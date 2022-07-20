<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('gateway_orders.title') }}</div>
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
            <el-form-item :label="$t('gateway_orders.order_no')" prop="number">
              <el-input
                v-model="listQuery.number"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('gateway_orders.merchant_uuid')" prop="merchant_uuid">
              <el-input
                v-model="listQuery.merchant_uuid"
                placeholder="Enter"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item :label="$t('gateway_orders.user_uuid')" prop="user_uuid">
              <el-input
                v-model="listQuery.user_uuid"
                placeholder="Enter"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item :label="$t('gateway_orders.currency')">
              <el-select
                v-model="listQuery.currency_code"
                filterable
                class="form-item-select"
                placeholder="Select"
                size="small"
                @change="onChange()"
              >
                <el-option key="" label="All" value="" />

                <el-option
                  v-for="(value, index) in currencyOptions"
                  :key="index.id"
                  :label="value.code"
                  :value="value.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('gateway_orders.status')" prop="status">
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
            <el-form-item
              :label="$t('gateway_orders.time_range')"
              prop="datetime_range"
            >
              <el-date-picker
                v-model="listQuery.datetime_range"
                type="datetimerange"
                range-separator="to"
                start-placeholder="Start"
                end-placeholder="End"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
            <el-form-item :label="$t('gateway_orders.reference_id')" prop="reference_id">
              <el-input
                v-model="listQuery.reference_id"
                placeholder="Enter"
                @keyup.enter.native="handleFilter"
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
        <el-table-column :label="$t('gateway_orders.number')">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('gateway_orders.merchant')">
          <template slot-scope="scope">
            <span>{{ scope.row.merchant_uuid }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('gateway_orders.user')">
          <template slot-scope="scope">
            <span>{{ scope.row.user_uuid }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('gateway_orders.reference_id')">
          <template slot-scope="scope">
            <span>{{ scope.row.reference_id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('gateway_orders.amount')">
          <template slot-scope="scope">
            <span>{{ scope.row.amount_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('gateway_orders.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('gateway_orders.create_date')">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
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
      <gateway-order-detail v-if="gateWayDetailVisible" :key="detailKey" :data="rowData" />
    </el-drawer>
  </div>
</template>

<script>
import { gateWayOrderIndex, gateWayStatusList } from '@/api/gateway_order'
import { currencyListOption } from '@/api/currency'
import Pagination from '@/components/Pagination'
import GatewayOrderDetail from '@/views/merchant/components/GateWayOrderDetail'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: {
    Pagination,
    OperateOptions,
    GatewayOrderDetail
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        number: '',
        merchant_uuid: '',
        user_uuid: '',
        currency_code: '',
        status: '',
        datetime_range: '',
        reference_id: ''
      },
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      rowData: {},
      statusOptions: [],
      currencyOptions: [],
      gateWayDetailVisible: false
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
      gateWayOrderIndex(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      gateWayStatusList().then((response) => {
        this.statusOptions = response.data.status
      })
      currencyListOption().then((response) => {
        this.currencyOptions = response.data
      })
    },
    onSearch() {
      if (this.listQuery.datetime_range !== '') {
        this.listQuery.start_date = this.listQuery.datetime_range[0]
        this.listQuery.end_date = this.listQuery.datetime_range[1]
      }
      this.fetchData(this.listQuery)
    },
    onReset() {
      this.$refs['listQuery'].resetFields()
      this.fetchData({})
    },
    handleAction(event, row) {
      console.log(event)
      if (event === 'view') {
        this.handleDetail(row)
      }
    },
    handleDetail(row) {
      this.closeDrawer()
      this.drawerTitle = 'Gateway Order Detail'
      this.drawerVisible = true
      this.gateWayDetailVisible = true
      this.detailKey = 'gateway order' + row.id
      this.rowData = row
    },
    closeDrawer() {
      this.drawerVisible = false
    }
  }
}
</script>
