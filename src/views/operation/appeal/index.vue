<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">
          {{ $t('appeal.appeal') }}
        </div>
      </div>

      <div class="filter-container" style="">
        <el-form
          ref="listQuery"
          :model="listQuery"
          :inline="true"
          size="small"
          label-width="110px"
        >
          <el-row>
            <el-form-item :label="$t('appeal.client_id')" prop="client_id">
              <el-input
                v-model="listQuery.client_id"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item
              :label="$t('appeal.merchant_uid')"
              prop="merchant_uid"
            >
              <el-input
                v-model="listQuery.merchant_uid"
                placeholder="Enter"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item :label="$t('appeal.type')" prop="type">
              <el-select v-model="listQuery.type" placeholder="Enter" clearable>
                <el-option key="" label="All" value="" />
                <el-option
                  v-for="(value, index) in typeOptions"
                  :key="index"
                  :label="value"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('appeal.status')" prop="status">
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
              :label="$t('fiat_trade_order.date_range')"
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
        <el-table-column :label="$t('appeal.id')">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('appeal.client_id')">
          <template slot-scope="scope">
            {{ scope.row.client_uuid }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('appeal.merchant_uid')">
          <template slot-scope="scope">
            <span>{{ scope.row.merchant_uuid }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('appeal.type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('appeal.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status_text }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('appeal.update_time')">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('appeal.manager')">
          <template slot-scope="scope">
            <span>{{ scope.row.admin_name }}</span>
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
      <appeal-editor
        v-if="editorVisible"
        :key="editorKey"
        :event="editorEvent"
        :data="rowData"
      />
    </el-drawer>
  </div>
</template>

<script>
import { appealLists, appealStatusList } from '@/api/appear'
import Pagination from '@/components/Pagination'
import AppealEditor from '@/views/operation/components/AppealEditor'
import OperateOptions from '@/components/OperateOptions'

export default {
  components: { Pagination, OperateOptions, AppealEditor },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        number: '',
        title: '',
        release_time: ''
      },
      operateOptions: [],
      drawerTitle: '',
      drawerVisible: false,
      editorEvent: '',
      editorVisible: false,
      editorKey: '',
      rowData: {},
      detailVisible: false,
      detailKey: '',
      statusOptions: [],
      typeOptions: [],
      solutionOptions: []
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
      appealLists(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      appealStatusList().then((response) => {
        this.statusOptions = response.data.status
        this.typeOptions = response.data.type
        this.solutionOptions = response.data.solution
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
      if (event === 'tracking') {
        this.handleUpdate(row)
      }
    },
    handleUpdate(row) {
      this.$router.push('/operation/appeal/tracking/' + row.id)
    },
    handleDelete(row) {},
    closeDrawer() {
      this.drawerVisible = false
      this.editorVisible = false
      this.detailVisible = false
      this.fetchData({})
    }
  }
}
</script>
