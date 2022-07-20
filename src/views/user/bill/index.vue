<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">
          {{ $t('user.user_bill') }}
        </div>
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
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('user.user_name')" prop="user_name">
              <el-input
                v-model="listQuery.user_name"
                placeholder="User Name"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('user.currency')" prop="currency_code">
              <el-select
                v-model="listQuery.currency_code"
                placeholder="Currency"
                clearable
                class="filter-item"
              >
                <el-option key="0" label="All" value="" />
                <el-option
                  v-for="(value, index) in currencyOptions"
                  :key="index"
                  :label="value"
                  :value="value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user.date')" prop="datetime_range">
              <el-date-picker
                v-model="listQuery.datetime_range"
                type="datetimerange"
                range-separator="to"
                start-placeholder="Start"
                end-placeholder="End"
                value-format="yyyy-MM-dd HH:mm:ss"
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
        <el-table-column :label="$t('user.uuid')" width="95">
          <template slot-scope="scope">
            {{ scope.row.uuid }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.user_name')">
          <template slot-scope="scope">
            {{ scope.row.user_name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.title')">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.currency_code')">
          <template slot-scope="scope">
            <span>{{ scope.row.currency_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.amount')">
          <template slot-scope="scope">
            <span>{{ scope.row.amount_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.create_at')">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('user.operate')"
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
      <user-bill-detail
        v-if="billDetailVisible"
        :key="billKey"
        :bill="billData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { userBill } from '@/api/user'
import { userStatusList } from '@/api/user_status'
import Pagination from '@/components/Pagination'
import UserBillDetail from '@/views/user/components/UserBillDetail'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, OperateOptions, UserBillDetail },
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
        number: '',
        currency: '',
        datetime_range: '',
        from_date: '',
        to_date: ''
      },
      currencyOptions: [],
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      billDetailVisible: false,
      billKey: '',
      billData: {}
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
      userBill(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      userStatusList().then((response) => {
        this.currencyOptions = response.data.currency
      })
    },
    onSearch() {
      console.log(this.listQuery)
      if (this.listQuery.datetime_range !== '') {
        this.listQuery.from_date = this.listQuery.datetime_range[0]
        this.listQuery.to_date = this.listQuery.datetime_range[1]
      }
      this.fetchData(this.listQuery)
    },
    onReset() {
      this.$refs['listQuery'].resetFields()
      this.fetchData({})
    },
    handleAction(event, row) {
      if (event === 'view') {
        this.handleDetail(row)
      }
    },
    handleDetail(row) {
      this.drawerTitle = 'User Bill Detail'
      this.drawerVisible = true
      this.billDetailVisible = true
      this.billKey = 'bill' + row.id
      this.billData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.billDetailVisible = false
    }
  }
}
</script>
