<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('fee_setting.title') }}</div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
      >
        <el-table-column :label="$t('fee_setting.name')">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fee_setting.client_fee')" class-name="status-col">
          <template slot-scope="scope">
            {{ scope.row.fee }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('fee_setting.merchant_commission')">
          <template slot-scope="scope">
            {{ scope.row.commission }}
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
      width="700px"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="200px"
        size="small"
      >
        <el-form-item :label="$t('fee_setting.client_fee')" prop="name">
          <el-input v-model="temp.fee" />
        </el-form-item>
        <el-form-item :label="$t('fee_setting.merchant_commission')" prop="bg_color">
          <el-input v-model="temp.commission" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button
          :loading="loading"
          type="primary"
          size="small"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  feeSettingList,
  feeSettingEdit,
  getFeeSetting
} from '@/api/fee-setting'

import OperateOptions from '@/components/OperateOptions'
import Pagination from '@/components/Pagination'

const defaultValueForm = {
  id: 0,
  name: '',
  fee: '',
  commission: ''
}

export default {
  components: { Pagination, OperateOptions },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      operateOptions: [],
      loading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit'
      },
      rules: {
        fee: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        commission: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: defaultValueForm,
      tempUrl: '',
      dataObj: { token: '', key: '' }
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
      feeSettingList(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
    },
    onSearch() {
      this.fetchData(this.listQuery)
    },
    resetTemp() {
      this.temp = {
        id: '',
        fee: '',
        commission: ''
      }
    },
    handleOpenPopup(target) {
      this.dialogStatus = target
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleAfterRequest(response) {
      const target = this.dialogStatus === 'create' ? 'Registered' : 'Updated'

      if (response.status === 200) {
        this.$message(target + ' Successfully!')
        this.dialogFormVisible = false
        this.fetchData({})
      } else {
        let messageError = ''
        Object.keys(response.data).forEach(function(key) {
          messageError += '\n' + response.data[key][0]
        })
        this.$message({
          message: target + ' Failed!' + '\n' + messageError,
          type: 'warning'
        })
      }
    },
    handleAction(event, row) {
      if (event === 'edit') {
        this.handleUpdate(row)
      }
    },
    handleUpdate(row) {
      getFeeSetting(row.id).then((response) => {
        const item = response.data
        this.temp = {
          id: item.id,
          fee: item.fee,
          commission: item.commission
        }
        this.handleOpenPopup('update')
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            fee: this.temp.fee,
            commission: this.temp.commission
          }
          feeSettingEdit(this.temp.id, data)
            .then((response) => {
              this.handleAfterRequest(response)
              this.loading = false
            })
            .catch((response) => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
