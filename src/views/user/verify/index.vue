<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('user.user_verify') }}</div>
        <div class="box-card-header-options" />
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
            <el-form-item :label="$t('user.uuid')" prop="uuid">
              <el-input
                v-model="listQuery.uuid"
                placeholder="Enter"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item :label="$t('user.user_name')" prop="user_name">
              <el-input
                v-model="listQuery.user_name"
                placeholder="Enter"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item :label="$t('user.type')" prop="type">
              <el-select
                v-model="listQuery.type"
                placeholder="Select"
                clearable
              >
                <el-option key="0" label="All" value="" />
                <el-option
                  v-for="(value, index) in typeOptions"
                  :key="index"
                  :label="value"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user.status')" prop="status">
              <el-select
                v-model="listQuery.status"
                placeholder="Select"
                clearable
              >
                <el-option key="0" label="All" value="" />
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
              <el-button type="primary" @click="onSearch">{{
                $t('table.search')
              }}</el-button>
              <el-button type="default" @click="onReset">{{
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
        size="mini"
      >
        <el-table-column :label="$t('user.uuid')">
          <template slot-scope="scope">
            {{ scope.row.uuid }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.user_name')">
          <template slot-scope="scope">
            {{ scope.row.user_name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.certificate')">
          <template slot-scope="scope">
            {{ scope.row.certificate_type_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.status')">
          <template slot-scope="scope">
            {{ scope.row.status_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.operate')" align="center">
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
      class="drawer"
      :wrapper-closable="false"
      :title="drawerTitle"
      :visible.sync="drawerVisible"
    >
      <user-verify-edit
        v-if="verifyEditVisible"
        :key="editKey"
        :event="editorEvent"
        :data="rowData"
      />
      <user-verify-detail
        v-if="verifyDetailVisible"
        :key="verifyKey"
        :verify="verifyData"
      />
      <user-verify-approve
        v-if="verifyApproveVisible"
        :key="approveKey"
        :verify="verifyData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { userVerify, userVerifyStatusList } from '@/api/user'
import Pagination from '@/components/Pagination'
import UserVerifyDetail from '@/views/user/components/UserVerifyDetail'
import UserVerifyEdit from '@/views/user/components/UserVerifyEdit'
import UserVerifyApprove from '@/views/user/components/UserVerifyApprove'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: {
    Pagination,
    OperateOptions,
    UserVerifyDetail,
    UserVerifyApprove,
    UserVerifyEdit
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        uuid: '',
        user_name: '',
        type: '',
        status: ''
      },
      typeOptions: [],
      statusOptions: [],
      operateOptions: {},
      drawerTitle: '',
      drawerVisible: false,
      verifyDetailVisible: false,
      verifyApproveVisible: false,
      verifyEditVisible: false,
      editorEvent: '',
      verifyKey: '0',
      approveKey: '0',
      editKey: '0',
      verifyData: [],
      rowData: {}
    }
  },
  created() {
    console.log(this.$route.meta)
    this.operateOptions = this.$route.meta.operate_options
    this.fetchData({})
    this.fetchStatus({})
  },
  methods: {
    fetchData(param) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      userVerify(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      userVerifyStatusList().then((response) => {
        console.log(response)
        this.typeOptions = response.data.type
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
      if (event === 'view') {
        this.handleDetail(row)
      } else if (event === 'approve') {
        this.handleApprove(row)
      } else if (event === 'edit') {
        this.handleEdit(row)
      }
    },
    handleDetail(row) {
      this.closeDrawer()
      this.drawerTitle = 'User Verify Detail'
      this.drawerVisible = true
      this.verifyDetailVisible = true
      this.verifyKey = 'verify-' + row.id
      this.verifyData = row
    },
    handleApprove(row) {
      this.closeDrawer()
      this.drawerTitle = 'User Verify Approve'
      this.drawerVisible = true
      this.verifyApproveVisible = true
      this.approveKey = 'approve-' + row.id
      this.verifyData = row
    },
    handleEdit(row) {
      this.closeDrawer()
      this.drawerTitle = 'User Verify Edit'
      this.drawerVisible = true
      this.verifyEditVisible = true
      this.editKey = 'edit-' + row.id
      this.editorEvent = 'edit'
      this.rowData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.verifyDetailVisible = false
      this.verifyApproveVisible = false
      this.verifyEditVisible = false
    }
  }
}
</script>
<style>
.rtl {
  width: 50% !important;
}
</style>
