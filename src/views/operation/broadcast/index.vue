<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('broadcast.broadcast') }}</div>
        <div class="box-card-header-options">
          <el-button size="mini" type="success" @click="handleCreate">{{
            $t('table.create')
          }}</el-button>
        </div>
      </div>

      <div class="filter-container" style="">
        <el-form
          ref="listQuery"
          :model="listQuery"
          :inline="true"
          size="small"
          label-width="100px"
        >
          <el-row>
            <el-form-item :label="$t('broadcast.number')" prop="number">
              <el-input
                v-model="listQuery.number"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('broadcast.title')" prop="title">
              <el-input
                v-model="listQuery.title"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('broadcast.date')" prop="release_time">
              <el-date-picker
                v-model="listQuery.release_time"
                type="date"
                placeholder="Pick a date"
                style="width: 100%"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="onSearch">{{
                $t('table.search')
              }}</el-button>
              <el-button type="default" size="small" @click="onReset">{{
                $t('table.reset')
              }}</el-button>
            </el-form-item>
          </el-row>
        </el-form>
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
        <el-table-column :label="$t('user.uuid')">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('broadcast.title')">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('broadcast.link')">
          <template slot-scope="scope">
            <span>{{ scope.row.link_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('broadcast.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('broadcast.release_time')">
          <template slot-scope="scope">
            <span>{{ scope.row.release_time }}</span>
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
      <broadcast-editor
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :data="rowData"
      />

      <broadcast-detail v-if="detailVisible" :key="detailKey" :data="rowData" />
    </el-drawer>
  </div>
</template>

<script>
import { broadcastLists } from '@/api/broadcast'
import Pagination from '@/components/Pagination'
import BroadcastEditor from '@/views/operation/components/BroadcastEditor'
import OperateOptions from '@/components/OperateOptions'
import BroadcastDetail from '../components/BroadcastDetail'

export default {
  components: { Pagination, OperateOptions, BroadcastEditor, BroadcastDetail },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        number: '',
        title: '',
        release_time: ''
      },
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
      rowData: {},
      detailVisible: false,
      detailKey: ''
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
      broadcastLists(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    onSearch() {
      this.fetchData(this.listQuery)
    },
    onReset() {
      this.$refs['listQuery'].resetFields()
      this.fetchData({})
    },
    handleAction(event, row) {
      if (event === 'edit') {
        this.handleUpdate(row)
      } else if (event === 'delete') {
        this.handleDelete(row)
      } else if (event === 'view') {
        this.handleDetail(row)
      }
    },
    handleCreate() {
      this.drawerTitle = 'Create Broadcast'
      this.drawerVisible = true
      this.editorEvent = 'create'
      this.editorVisible = true
      this.editorKey = 'create'
    },
    handleUpdate(row) {
      this.closeDrawer()
      this.drawerTitle = 'Edit Broadcast'
      this.drawerVisible = true
      this.editorEvent = 'edit'
      this.editorVisible = true
      this.editorKey = 'edit-' + row.id
      this.rowData = row
    },
    handleDetail(row) {
      this.closeDrawer()
      this.drawerTitle = 'Broadcast Detail'
      this.drawerVisible = true
      this.detailVisible = true
      this.detailKey = 'view-' + row.id
      this.rowData = row
    },
    handleDelete(row) {},
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
      this.detailVisible = false
      this.fetchData({})
    }
  }
}
</script>
