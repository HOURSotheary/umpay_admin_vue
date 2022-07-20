<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('exchange_rate.title') }}</div>
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
          label-width="150px"
        >
          <el-row>
            <el-form-item :label="$t('exchange_rate.from')">
              <el-select
                v-model="listQuery.from_currency_code"
                filterable
                class="form-item-select"
                placeholder="Select"
                size="small"
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

            <el-form-item :label="$t('exchange_rate.to')">
              <el-select
                v-model="listQuery.to_currency_code"
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

            <el-form-item :label="$t('exchange_rate.status')" prop="status">
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
                  :value="Number(index)"
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
        <el-table-column :label="$t('exchange_rate.from')">
          <template slot-scope="scope">
            {{ scope.row.from_currency_code }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('exchange_rate.to')">
          <template slot-scope="scope">
            <span>{{ scope.row.to_currency_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('exchange_rate.rate')">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('exchange_rate.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('exchange_rate.updated_at')">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at }}</span>
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
      <rate-editor
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :data="rowData"
      />
      <exchange-rate-detail
        v-if="rateDetailVisible"
        :key="rateKey"
        :rate="rateData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { exchangeRateIndex, exchangeOptions } from '@/api/exchange'
import { currencyListOption } from '@/api/currency'

import Pagination from '@/components/Pagination'
import RateEditor from '@/views/exchange/components/RateEditor'
import ExchangeRateDetail from '@/views/exchange/components/ExchangeRateDetail'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, RateEditor, OperateOptions, ExchangeRateDetail },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        from_currency_code: '',
        to_currency_code: '',
        status: 1
      },
      statusOptions: [],
      operateOptions: [],
      currencyOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
      rowData: {},
      rateDetailVisible: false
    }
  },
  created() {
    this.operateOptions = this.$route.meta.operate_options
    this.fetchData(this.listQuery)
    this.fetchStatus({})
  },
  methods: {
    fetchData(param) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      exchangeRateIndex(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      exchangeOptions().then((response) => {
        this.statusOptions = response.data.status
      })
      currencyListOption().then((response) => {
        this.currencyOptions = response.data
      })
    },
    onSearch() {
      this.fetchData(this.listQuery)
    },
    onReset() {
      this.$refs['listQuery'].resetFields()
      this.fetchData({})
    },
    handleCreate() {
      this.closeDrawer()
      this.drawerTitle = 'Create Rate'
      this.drawerVisible = true
      this.editorEvent = 'create'
      this.editorVisible = true
      var timestamp = new Date().getTime()
      this.editorKey = 'create' + timestamp
    },
    handleAction(event, row) {
      if (event === 'view') {
        this.handleDetail(row)
      }
    },
    handleDetail(row) {
      this.closeDrawer()
      this.drawerTitle = 'Exchange Rate Detail'
      this.drawerVisible = true
      this.rateDetailVisible = true
      this.rateKey = 'exchange rate' + row.id
      this.rateData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
      this.rateDetailVisible = false
      this.fetchData(this.listQuery)
    }
  }
}
</script>
