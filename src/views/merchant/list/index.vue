<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('merchant.title') }}</div>
      </div>

      <div class="filter-container" style="">
        <el-form
          ref="listQuery"
          :model="listQuery"
          :inline="true"
          size="small"
          label-width="120px"
        >
          <el-row>
            <el-form-item :label="$t('merchant.merchant_id')" prop="uuid">
              <el-input
                v-model="listQuery.merchant_id"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item
              :label="$t('merchant.verification')"
              prop="verify_status"
            >
              <el-select
                v-model="listQuery.verify_status"
                placeholder="Enter"
                clearable
              >
                <el-option key="" label="All" value="" />
                <el-option
                  v-for="(value, index) in verificationOptions"
                  :key="index"
                  :label="value"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('merchant.gateway_enable')" prop="gateway">
              <el-select
                v-model="listQuery.gateway"
                placeholder="Enter"
                clearable
              >
                <el-option key="" label="All" value="" />
                <el-option
                  v-for="(value, index) in gatewayOptions"
                  :key="index"
                  :label="value"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('merchant.status')" prop="user_status">
              <el-select
                v-model="listQuery.user_status"
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
        <el-table-column :label="$t('merchant.merchant_name')">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('merchant.verification')">
          <template slot-scope="scope">
            <span>{{ scope.row.verify_status }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('merchant.gateway_enable')">
          <template slot-scope="scope">
            <span>{{ scope.row.gateway_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('merchant.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.user_status }}</span>
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
      <merchant-baseinfo
        v-if="baseinfoVisible"
        :key="userKey"
        :data="baseinfoData"
      />
      <merchant-statistic
        v-if="statisticVisible"
        :key="userKey"
        :data="userData"
      />
      <merchant-gateway v-if="gatewayVisible" :key="userKey" :data="userData" />
      <merchant-ipwhitelist
        v-if="ipwhitelistVisible"
        :key="userKey"
        :data="userData"
      />
      <merchant-priority
        v-if="priorityVisible"
        :key="userKey"
        :data="userData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { merchantIndex, merchantStatusList } from '@/api/merchant'
import Pagination from '@/components/Pagination'
import MerchantBaseinfo from '@/views/merchant/components/MerchantBaseinfo'
import MerchantStatistic from '@/views/merchant/components/MerchantStatistic'
import MerchantGateway from '@/views/merchant/components/MerchantGateway'
import MerchantIpwhitelist from '@/views/merchant/components/MerchantIpwhitelist'
import MerchantPriority from '@/views/merchant/components/MerchantPriority'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: {
    Pagination,
    OperateOptions,
    MerchantBaseinfo,
    MerchantStatistic,
    MerchantGateway,
    MerchantIpwhitelist,
    MerchantPriority
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        verify_status: '',
        user_status: '',
        gateway: ''
      },
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
      rowData: {},
      baseinfoData: {},
      baseinfoVisible: false,
      statisticVisible: false,
      ipwhitelistVisible: false,
      gatewayVisible: false,
      priorityVisible: false,
      onlineOptions: [],
      gatewayOptions: [],
      verificationOptions: [],
      statusOptions: []
    }
  },
  created() {
    this.operateOptions = this.$route.meta.operate_options
    console.log(this.operateOptions)
    this.fetchData({})
    this.fetchStatus({})
  },
  methods: {
    fetchData(param) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      merchantIndex(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      merchantStatusList().then((response) => {
        this.onlineOptions = response.data.online
        this.gatewayOptions = response.data.gateway
        this.verificationOptions = response.data.verification
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
      if (event === 'baseinfo') {
        this.handleBaseInfo(row)
      } else if (event === 'statistic') {
        this.handleStatistics(row)
      } else if (event === 'gateway') {
        this.handleGateway(row)
      } else if (event === 'ip-whitelist') {
        this.handleIPWhitelist(row)
      } else if (event === 'priority') {
        this.handlePriority(row)
      }
    },
    handleBaseInfo(row) {
      this.closeDrawer()
      this.drawerTitle = 'Base Info:' + row.name
      this.drawerVisible = true
      this.baseinfoVisible = true
      this.baseinfoEvent = 'baseinfo'
      this.userKey = 'baseinfo-' + row.id
      this.baseinfoData = row
    },
    handleStatistics(row) {
      this.closeDrawer()
      this.drawerTitle = 'Statistic: ' + row.name
      this.drawerVisible = true
      this.statisticVisible = true
      this.userKey = 'statistic-' + row.id
      this.userData = row
    },
    handleGateway(row) {
      this.closeDrawer()
      this.drawerTitle = 'Gateway Setting: ' + row.name
      this.drawerVisible = true
      this.gatewayVisible = true
      this.userKey = 'pin-' + row.id
      this.userData = row
    },
    handlePriority(row) {
      this.closeDrawer()
      this.drawerTitle = 'Priority: ' + row.name
      this.drawerVisible = true
      this.priorityVisible = true
      this.userKey = 'priority-' + row.id
      this.userData = row
    },
    handleIPWhitelist(row) {
      this.closeDrawer()
      this.drawerTitle = 'IP White List: ' + row.name
      this.drawerVisible = true
      this.ipwhitelistVisible = true
      this.userKey = 'ip white list-' + row.id
      this.userData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.baseinfoVisible = false
      this.statisticVisible = false
      this.gatewayVisible = false
      this.priorityVisible = false
      this.ipwhitelistVisible = false
    }
  }
}
</script>
