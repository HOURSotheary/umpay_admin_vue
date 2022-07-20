<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">
          {{ $t('trade_stock_order.title') }}
        </div>
        <div class="box-card-header-options" />
      </div>

      <div class="filter-container" style="">
        <el-form
          ref="listQuery"
          :model="listQuery"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-row>
            <el-form-item :label="$t('trade_stock_order.uuid')" prop="uuid">
              <el-input
                v-model="listQuery.uuid"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('trade_stock_order.user_name')" prop="user_name">
              <el-input
                v-model="listQuery.user_name"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('trade_stock_order.number')" prop="number">
              <el-input
                v-model="listQuery.number"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>

            <el-form-item
              :label="$t('trade_stock_order.merchant_name')"
              prop="merchant_name"
            >
              <el-input
                v-model="listQuery.merchant_name"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('trade_stock_order.status')" prop="status">
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
            <el-form-item :label="$t('trade_stock_order.type')" prop="status">
              <el-select
                v-model="listQuery.type"
                placeholder="Enter"
                clearable
              >
                <el-option key="" label="All" value="" />
                <el-option
                  v-for="(value, index) in typeOptions"
                  :key="index"
                  :label="value"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('trade_stock_order.date_range')"
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
        <el-table-column :label="$t('trade_stock_order.number')" width="130px">
          <template slot-scope="scope">
            {{ scope.row.number_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.uuid')">
          <template slot-scope="scope">
            {{ scope.row.uuid }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.user_name')">
          <template slot-scope="scope">
            {{ scope.row.user_info.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.currency_currency')">
          <template slot-scope="scope">
            <span>{{ scope.row.currency_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.currency_amount')">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.merchant_name')">
          <template slot-scope="scope">
            {{ scope.row.merchant_name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('trade_stock_order.create_at')">
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

    <el-dialog
      width="50%"
      :wrapper-closable="false"
      :title="drawerTitle"
      :visible.sync="drawerVisible"
    >
      <trade-stock-order-detail
        v-if="detailVisible"
        :key="detailKey"
        :data="detailData"
      />

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDrawer"> Close </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tradeStockOrder, stockOrderStatusList } from '@/api/trade-stock'
import Pagination from '@/components/Pagination'
import TradeStockOrderDetail from '@/views/trade-stock/components/TradeStockOrderDetail'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, OperateOptions, TradeStockOrderDetail },
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
        datetime_range: '',
        start_time: '',
        end_time: '',
        status: '',
        type: ''
      },
      statusOptions: [],
      typeOptions: [],
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      detailVisible: false,
      detailKey: '',
      detailData: {}
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
      tradeStockOrder(this.listQuery).then((response) => {
        this.list = response.data.lists
        console.log(this.list)
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      stockOrderStatusList().then((response) => {
        this.typeOptions = response.data.type
        this.statusOptions = response.data.status
      })
    },
    onSearch() {
      if (this.listQuery.datetime_range !== '') {
        this.listQuery.start_time = this.listQuery.datetime_range[0]
        this.listQuery.end_time = this.listQuery.datetime_range[1]
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
      this.drawerTitle = 'Trade Stock Order Detail'
      this.drawerVisible = true
      this.detailVisible = true
      this.detailKey = 'detail' + row.id
      this.detailData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.detailVisible = false
    }
  }
}
</script>
