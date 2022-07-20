<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('rule.title') }}</div>
        <div class="box-card-header-options">
          <el-button
            size="mini"
            type="success"
            @click="handleCreate"
          >Create</el-button>
        </div>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        :stripe="true"
        size="mini"
      >
        <el-table-column :label="$t('rule.name')">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('rule.description')">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
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
      <role-editor
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :data="rowData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { roleList, roleDelete } from '@/api/role'
import Pagination from '@/components/Pagination'
import RoleEditor from '@/views/manager/components/RoleEditor'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, OperateOptions, RoleEditor },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      statusOptions: [],
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
      rowData: {}
    }
  },
  created() {
    this.operateOptions = this.$route.meta.operate_options
    this.fetchData({})
  },
  methods: {
    fetchData(param) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      roleList(data).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    handleAction(event, row) {
      if (event === 'edit') {
        this.$router.push('/manager/role/edit/' + row.id)
      } else if (event === 'delete') {
        this.handleDelete(row)
      }
    },
    handleCreate() {
      this.$router.push('/manager/role/create')
    },
    handleUpdate(row) {
      this.drawerTitle = 'Edit Manager'
      this.drawerVisible = true
      this.editorEvent = 'edit'
      this.editorVisible = true
      this.editorKey = 'edit-' + row.id
      this.rowData = row
    },
    handleDelete(row) {
      roleDelete(row.id)
        .then((response) => {
          if (response.code === 200) {
            this.$message('Delete Successfully!')
            this.fetchData({})
          }
        })
        .catch((response) => {})
    },
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
    }
  }
}
</script>
