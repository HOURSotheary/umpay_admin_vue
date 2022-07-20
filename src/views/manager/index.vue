<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('manager.title') }}</div>
        <div class="box-card-header-options">
          <el-button
            size="mini"
            type="success"
            @click="handleCreate"
          >Create</el-button>
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
            <el-form-item :label="$t('manager.name')" prop="name">
              <el-input
                v-model="listQuery.name"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('manager.status')" prop="status">
              <el-select
                v-model="listQuery.status"
                placeholder="Enter"
                clearable
              >
                <el-option key="" label="All" value="" />
                <el-option
                  v-for="(value, index) in statusOptions"
                  :key="index"
                  :label="value"
                  :value="index"
                />
              </el-select>
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
        <el-table-column :label="$t('manager.name')">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('manager.role')">
          <template slot-scope="scope">
            <span>{{ scope.row.role_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Log">
          <template slot-scope="scope">
            <span>{{ scope.row.lock_number }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('manager.description')">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('manager.status')">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status_text | statusFilter">
              {{ scope.row.status_text }}
            </el-tag>
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
      <manager-editor
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :data="rowData"
      />
      <manager-editor-password
        v-if="editorPasswordVisible"
        :key="editorPasswordKey"
        :event="editorPasswordEvent"
        :data="rowData"
      />
      <manager-editor-pin
        v-if="editorPinVisible"
        :key="editorPinKey"
        :event="editorPinEvent"
        :data="rowData"
      />
    </el-drawer>
  </div>
</template>

<script>
import {
  managerLists,
  managerStatusList,
  managerDelete,
  managerUnlock
} from '@/api/manager'
import Pagination from '@/components/Pagination'
import ManagerEditor from '@/views/manager/components/ManagerEditor'
import ManagerEditorPassword from '@/views/manager/components/ManagerEditorPassword'
import ManagerEditorPin from '@/views/manager/components/ManagerEditorPin'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: {
    Pagination,
    OperateOptions,
    ManagerEditor,
    ManagerEditorPassword,
    ManagerEditorPin
  },
  filters: {
    statusFilter(status_text) {
      const statusMap = {
        Lock: 'danger'
      }
      return statusMap[status_text]
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        id: '',
        name: '',
        status: ''
      },
      statusOptions: [],
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorPasswordEvent: '',
      editorPinEvent: '',
      editorVisible: false,
      editorPasswordVisible: false,
      editorPinVisible: false,
      editorKey: '',
      editorPasswordKey: '',
      editorPinKey: '',
      rowData: {}
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
      managerLists(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      managerStatusList().then((response) => {
        this.statusOptions = response.data.status
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
      console.log(event)
      console.log(row)
      if (event === 'edit') {
        this.handleUpdate(row)
      } else if (event === 'delete') {
        this.handleDelete(row)
      } else if (event === 'edit-password') {
        this.handleUpdatePassword(row)
      } else if (event === 'edit-pin') {
        this.handleUpdatePin(row)
      } else if (event === 'unlock') {
        this.handleUnlock(row)
      }
    },
    handleCreate() {
      this.drawerTitle = 'Create Manager'
      this.drawerVisible = true
      this.editorEvent = 'create'
      this.editorVisible = true
      this.editorKey = 'create'
    },
    handleUpdate(row) {
      this.closeDrawer()
      this.drawerTitle = 'Edit Manager'
      this.drawerVisible = true
      this.editorEvent = 'edit'
      this.editorVisible = true
      this.editorKey = 'edit-' + row.id
      this.rowData = row
    },
    handleUpdatePassword(row) {
      this.closeDrawer()
      this.drawerTitle = 'Edit Password'
      this.drawerVisible = true
      this.editorPasswordEvent = 'edit-password'
      this.editorPasswordVisible = true
      this.editorKey = 'edit-password' + row.id
      this.rowData = row
    },
    handleUpdatePin(row) {
      this.closeDrawer()
      this.drawerTitle = 'Setting Pin'
      this.drawerVisible = true
      this.editorPinEvent = 'edit-pin'
      this.editorPinVisible = true
      this.editorKey = 'edit-pin' + row.id
      this.rowData = row
    },
    handleUnlock(row) {
      // console.log('hhh' + row.id)
      managerUnlock(row.id)
        .then((response) => {
          if (response.status === 200) {
            this.$message('Unlock Successfully!')
            this.fetchData({})
          }
        })
        .catch((response) => {})
    },
    handleDelete(row) {
      managerDelete(row.id)
        .then((response) => {
          if (response.status === 200) {
            this.$message('Delete Successfully!')
            this.fetchData({})
          }
        })
        .catch((response) => {})
    },
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
      this.editorPasswordVisible = false
      this.editorPinVisible = false
      this.fetchData({})
    }
  }
}
</script>
