<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('finance.title') }}</div>
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
            <el-form-item :label="$t('finance.name')" prop="name">
              <el-input
                v-model="listQuery.name"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item
              :label="$t('finance.date_range')"
              prop="datetime_range"
            >
              <el-date-picker
                v-model="listQuery.datetime_range"
                type="datetimerange"
                range-separator="to"
                start-placeholder="From"
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
        <el-table-column :label="$t('finance.number')">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.from')">
          <template slot-scope="scope">
            {{ scope.row.from_user }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.to')">
          <template slot-scope="scope">
            <span>{{ scope.row.to_user }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.currency')">
          <template slot-scope="scope">
            <span>{{ scope.row.currency_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.amount')">
          <template slot-scope="scope">
            <span>{{ scope.row.amount_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.date')">
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
      <transfer-detail
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :parmas="rowData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { transferIndex } from '@/api/finance'
import Pagination from '@/components/Pagination'
import TransferDetail from '@/views/finance/components/TransferDetail'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, OperateOptions, TransferDetail },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        uuid: '',
        name: '',
        status: '',
        datetime_range: '',
        from_date: '',
        to_date: ''
      },
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
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
      transferIndex(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {},
    onSearch() {
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
      this.drawerTitle = 'Transfer Detail'
      this.drawerVisible = true
      this.editorVisible = true
      this.editorKey = 'transfer' + row.id
      this.rowData = row
    },
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
      this.fetchData({})
    }
  }
}
</script>
