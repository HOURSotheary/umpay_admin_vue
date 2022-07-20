<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('user.User_List') }}</div>
      </div>
      <div class="filter-container" style="">
        <el-row>
          <el-form
            ref="listQuery"
            :model="listQuery"
            :inline="true"
            label-width="100px"
            size="small"
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
              <el-form-item :label="$t('user.phone')" prop="phone">
                <el-input
                  v-model="listQuery.phone"
                  placeholder="Enter"
                  @keyup.enter.native="handleFilter"
                />
              </el-form-item>

              <el-form-item :label="$t('user.merchant')" prop="merchant">
                <el-select
                  v-model="listQuery.merchant"
                  placeholder="Enter"
                  clearable
                >
                  <el-option key="" label="All" value="" />
                  <el-option
                    v-for="(value, index) in merchantOptions"
                    :key="index"
                    :label="value"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('user.status')" prop="status">
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
              <el-form-item :label="$t('user.email')" prop="email">
                <el-input
                  v-model="listQuery.email"
                  placeholder="Enter"
                  @keyup.enter.native="handleFilter"
                />
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
        </el-row>
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
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.email')">
          <template slot-scope="scope">
            {{ scope.row.email }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('user.bill')">
          <template slot-scope="scope">
            <span>{{ scope.row.bill_count }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.verification')">
          <template slot-scope="scope">
            <span>{{ scope.row.verification_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.merchant')">
          <template slot-scope="scope">
            <span>{{ scope.row.merchant_text }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('user.status')"
          class-name="status-col"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status_text | statusFilter">
              {{ scope.row.status_text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('user.status')"
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
      <user-basic
        v-if="basicVisible"
        :key="userKey"
        :event="basicEvent"
        :data="basicData"
      />

      <user-password v-if="passVisible" :key="userKey" :user="userData" />

      <user-pin v-if="pinVisible" :key="userKey" :user="userData" />

      <user-priority v-if="priorityVisible" :key="userKey" :user="userData" />

      <user-statistics
        v-if="statisticsVisible"
        :key="userKey"
        :user="userData"
      />

      <user-payment-account
        v-if="paymentAccountVisible"
        :key="userKey"
        :user="userData"
      />

      <user-deposit v-if="depositVisible" :key="userKey" :parmas="userData" />

      <user-withdraw v-if="withdrawVisible" :key="userKey" :parmas="userData" />
    </el-drawer>
  </div>
</template>

<script>
import {
  userList,
  userStatusList,
  userVerifyStatusList,
  userUnlock
} from '@/api/user'
import Pagination from '@/components/Pagination'
import UserBasic from '@/views/user/components/UserBasic'
import UserPassword from '@/views/user/components/UserPassword'
import UserPin from '@/views/user/components/UserPin'
import UserPriority from '@/views/user/components/UserPriority'
import UserStatistics from '@/views/user/components/UserStatistics'
import UserPaymentAccount from '@/views/user/components/UserPaymentAccount'
import UserDeposit from '@/views/user/components/UserDeposit'
import UserWithdraw from '@/views/user/components/UserWithdraw'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: {
    Pagination,
    OperateOptions,
    UserBasic,
    UserPassword,
    UserPin,
    UserPriority,
    UserStatistics,
    UserPaymentAccount,
    UserDeposit,
    UserWithdraw
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
        uuid: '',
        verify: '',
        merchant: '',
        status: ''
      },
      verifyOptions: [],
      merchantOptions: [],
      statusOptions: [],
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      basicVisible: false,
      basicEvent: '',
      basicData: {},
      userKey: '',
      userData: {},
      passVisible: false,
      pinVisible: false,
      priorityVisible: false,
      statisticsVisible: false,
      paymentAccountVisible: false,
      depositVisible: false,
      withdrawVisible: false
    }
  },
  created() {
    this.operateOptions = this.$route.meta.operate_options
    console.log(this.operateOptions)
    this.fetchData({})
    this.fetchStatus({})
  },
  methods: {
    fetchData(param = {}) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      userList(this.listQuery).then((response) => {
        console.log(response)
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      userStatusList().then((response) => {
        this.merchantOptions = response.data.merchant
        this.statusOptions = response.data.status
      })
      userVerifyStatusList().then((response) => {
        this.verifyOptions = response.data.status
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
      if (event === 'basic') {
        this.handleBasic(row)
      } else if (event === 'password') {
        this.handlePassword(row)
      } else if (event === 'pin') {
        this.handlePin(row)
      } else if (event === 'priority') {
        this.handlePriority(row)
      } else if (event === 'statistics') {
        this.handleStatistics(row)
      } else if (event === 'account') {
        this.handlePaymentAccount(row)
      } else if (event === 'deposit') {
        this.handleDeposit(row)
      } else if (event === 'withdraw') {
        this.handleWithdraw(row)
      } else if (event === 'user-unlock') {
        this.handleUnlock(row)
      }
    },
    handleCreate() {
      this.closeDrawer()
      this.drawerTitle = 'Create User'
      this.drawerVisible = true
      this.basicVisible = true
      this.basicEvent = 'create'
      this.basicData = {}
    },
    handleBasic(row) {
      this.closeDrawer()
      this.drawerTitle = 'Checking user:' + row.uuid
      this.drawerVisible = true
      this.basicVisible = true
      this.basicEvent = 'edit'
      this.userKey = 'basic-' + row.id
      this.basicData = row
    },

    handleUnlock(row) {
      userUnlock(row.id)
        .then((response) => {
          if (response.status === 200) {
            this.$message('Unlock Successfully!')
            this.fetchData({})
          }
        })
        .catch((response) => {})
    },
    handlePassword(row) {
      this.closeDrawer()
      this.drawerTitle = 'Setting user: ' + row.uuid
      this.drawerVisible = true
      this.passVisible = true
      this.userKey = 'pass-' + row.id
      this.userData = row
    },
    handlePin(row) {
      this.closeDrawer()
      this.drawerTitle = 'Setting user: ' + row.uuid
      this.drawerVisible = true
      this.pinVisible = true
      this.userKey = 'pin-' + row.id
      this.userData = row
    },
    handlePriority(row) {
      this.closeDrawer()
      this.drawerTitle = 'Setting user: ' + row.uuid
      this.drawerVisible = true
      this.priorityVisible = true
      this.userKey = 'priority-' + row.id
      this.userData = row
    },
    handleStatistics(row) {
      this.closeDrawer()
      this.drawerTitle = 'Checking user: ' + row.uuid
      this.drawerVisible = true
      this.statisticsVisible = true
      this.userKey = 'statistics-' + row.id
      this.userData = row
    },
    handlePaymentAccount(row) {
      this.closeDrawer()
      this.drawerTitle = 'Checking user: ' + row.uuid
      this.drawerVisible = true
      this.paymentAccountVisible = true
      this.userKey = 'account-' + row.id
      this.userData = row
    },
    handleDeposit(row) {
      this.closeDrawer()
      this.drawerTitle = 'Deposit to user: ' + row.uuid
      this.drawerVisible = true
      this.depositVisible = true
      this.userKey = 'deposit-' + row.id
      this.userData = row
    },
    handleWithdraw(row) {
      this.closeDrawer()
      this.drawerTitle = 'Withdraw to user: ' + row.uuid
      this.drawerVisible = true
      this.withdrawVisible = true
      this.userKey = 'withdraw-' + row.id
      this.userData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.basicVisible = false
      this.passVisible = false
      this.pinVisible = false
      this.priorityVisible = false
      this.statisticsVisible = false
      this.paymentAccountVisible = false
      this.depositVisible = false
      this.withdrawVisible = false
    }
  }
}
</script>
