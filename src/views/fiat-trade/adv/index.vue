<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('user.user_bill') }}</div>
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
            <el-form-item :label="$t('user.uuid')" prop="uuid">
              <el-input
                v-model="listQuery.uuid"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('fiat_trade_adv.number')" prop="number">
              <el-input
                v-model="listQuery.number"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>

            <el-form-item :label="$t('user.merchant')" prop="merchant_name">
              <el-input
                v-model="listQuery.merchant_name"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item
              :label="$t('fiat_trade_adv.date_range')"
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
        <el-table-column :label="$t('fiat_trade_adv.number')" width="200px">
          <template slot-scope="scope">
            {{ scope.row.number_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.uuid')" width="120px">
          <template slot-scope="scope">
            {{ scope.row.uuid }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.merchant_name')">
          <template slot-scope="scope">
            {{ scope.row.merchant_name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.crypto_currency')">
          <template slot-scope="scope">
            <span>{{ scope.row.crypto_currency_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.crypto_amount')">
          <template slot-scope="scope">
            {{ scope.row.crypto_amount_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.price')">
          <template slot-scope="scope">
            {{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.crypto_balance')">
          <template slot-scope="scope">
            {{ scope.row.crypto_balance_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.fiat_currency')">
          <template slot-scope="scope">
            <span>{{ scope.row.fiat_currency_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('fiat_trade_adv.fiat_amount')">
          <template slot-scope="scope">
            <span>{{ scope.row.fiat_amount_text }}</span>
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
      <trade-fiat-ads-detail
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
import { tradeFaitAds } from '@/api/trade-fiat'
import { userStatusList } from '@/api/user_status'
import Pagination from '@/components/Pagination'
import TradeFiatAdsDetail from '@/views/fiat-trade/components/TradeFiatAdsDetail'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, OperateOptions, TradeFiatAdsDetail },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        uuid: '',
        merchant_name: '',
        number: '',
        datetime_range: '',
        start_time: '',
        end_time: ''
      },
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
      tradeFaitAds(this.listQuery).then((response) => {
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
      this.drawerTitle = 'Trade Fiat Ads Detail'
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
