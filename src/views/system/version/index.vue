<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('version.title') }}</div>
        <div class="box-card-header-options">
          <el-button
            size="small"
            type="success"
            @click="handleCreate"
          >{{ $t('table.create') }}
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
      >
        <el-table-column :label="$t('version.language')">
          <template slot-scope="scope">
            {{ scope.row.language_text }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('version.titles')">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('version.number')">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('version.must')">
          <template slot-scope="scope">
            {{ scope.row.must_text }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('version.status')" class-name="status-col">
          <template slot-scope="scope">
            {{ scope.row.status_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('version.release_time')">
          <template slot-scope="scope">
            {{ scope.row.release_at }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <operate-options
              :options="operateOptions"
              :row="row"
              @action="handleAction"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"
      />
    </el-card>
    <el-drawer
      :wrapper-closable="false"
      :title="drawerTitle"
      :visible.sync="drawerVisible"
    >
      <version-editor
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :data="rowData"
      />

      <version-detail v-if="detailVisible" :key="detailKey" :data="rowData" />
    </el-drawer>
  </div>
</template>

<script>
import { versionList, versionStatusList } from '@/api/version'
import OperateOptions from '@/components/OperateOptions'
import VersionEditor from '@/views/system/components/VersionEditor'
import VersionDetail from '../components/VersionDetail'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination, OperateOptions, VersionEditor, VersionDetail },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      formSearch: {
        status: undefined,
        title: ''
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
      rowData: {},
      detailVisible: false,
      detailKey: '',
      dialogStatus: '',
      textMap: {
        update: this.$t('form.edit'),
        create: this.$t('form.create')
      },
      rules: {
        title: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        number: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        status: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('form.required')
          }
        ]
      },
      statusOptions: [],
      temp: {
        id: '',
        title: '',
        number: '',
        must: '',
        release_at: '',
        status: undefined,
        language: ''
      },
      language: null,
      must: null
    }
  },
  created() {
    this.operateOptions = this.$route.meta.operate_options
    this.fetchData({})
    this.fetchStatus({})
  },
  methods: {
    fetchData(param) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      versionList(data).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    handleAction(event, row) {
      if (event === 'edit') {
        this.handleUpdate(row)
      } else if (event === 'view') {
        this.handleDetail(row)
      }
    },
    fetchStatus() {
      versionStatusList().then((response) => {
        console.log(response)
        this.statusOptions = response.data.status
      })
    },
    onSearch() {
      console.log(this.formSearch)
      this.fetchData(this.formSearch)
    },
    handleCreate() {
      this.drawerTitle = 'Create Version'
      this.drawerVisible = true
      this.editorEvent = 'create'
      this.editorVisible = true
      this.editorKey = 'create'
    },
    handleUpdate(row) {
      this.closeDrawer()
      this.drawerTitle = 'Edit Version'
      this.drawerVisible = true
      this.editorEvent = 'edit'
      this.editorVisible = true
      this.editorKey = 'edit-' + row.id
      this.rowData = row
    },
    handleDetail(row) {
      this.closeDrawer()
      this.drawerTitle = 'Version Detail'
      this.drawerVisible = true
      this.detailVisible = true
      this.detailKey = 'view-' + row.id
      this.rowData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
      this.detailVisible = false
      this.fetchData({})
    }
  }
}
</script>
