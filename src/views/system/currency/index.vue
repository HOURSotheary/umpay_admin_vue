<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('currency.title') }}</div>
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
          label-width="120px"
          size="small"
        >
          <el-form-item :label="$t('currency.name')">
            <el-input
              v-model="listQuery.name"
              placeholder="Enter"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item :label="$t('currency.code')">
            <el-input
              v-model="listQuery.code"
              placeholder="Enter"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item :label="$t('currency.type')">
            <el-select v-model="listQuery.type" placeholder="Select" clearable>
              <el-option :key="0" :label="$t('currency.all')" :value="0" />
              <el-option
                v-for="(value, index) in typeOptions"
                :key="Number(index)"
                :label="value"
                :value="Number(index)"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('currency.status')">
            <el-select
              v-model="listQuery.status"
              placeholder="Select"
              clearable
            >
              <el-option :key="0" :label="$t('currency.all')" :value="0" />
              <el-option
                v-for="(value, index) in statusOptions"
                :key="Number(index)"
                :label="value"
                :value="Number(index)"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-button
              type="primary"
              size="small"
              @click="onSearch"
            >{{ $t('table.search') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
      >
        <el-table-column :label="$t('currency.icon')">
          <template slot-scope="scope">
            <el-image
              style="width: 20px; height: 20px"
              :src="scope.row.icon_url"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('currency.name')">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('currency.code')">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('currency.symbol')">
          <template slot-scope="scope">
            <span>{{ scope.row.symbol }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('currency.iso_no')">
          <template slot-scope="scope">
            <span>{{ scope.row.iso_no }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('currency.type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type_text }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('currency.status')"
          class-name="status-col"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.status_text }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button
              type="default"
              size="mini"
              :row="row"
              @click="handleUpdate(row)"
            >
              Edit
            </el-button>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="150px">
        <el-form-item :label="$t('currency.name')" prop="name">
          <el-input v-model="temp.name" size="small" />
        </el-form-item>
        <el-form-item :label="$t('currency.code')" prop="code">
          <el-input v-model="temp.code" size="small" />
        </el-form-item>
        <el-form-item :label="$t('currency.symbol')" prop="symbol">
          <el-input v-model="temp.symbol" size="small" />
        </el-form-item>
        <el-form-item :label="$t('currency.iso_no')" prop="iso_no">
          <el-input v-model="temp.iso_no" size="small" />
        </el-form-item>
        <el-form-item :label="$t('currency.limit_min_deposit')" prop="limit_min_deposit">
          <el-input v-model="temp.limit_min_deposit" size="small" />
        </el-form-item>
        <el-form-item :label="$t('currency.limit_min_withdraw')" prop="limit_min_withdraw">
          <el-input v-model="temp.limit_min_withdraw" size="small" />
        </el-form-item>
        <el-form-item :label="$t('currency.type')">
          <el-select
            v-model="temp.type"
            class="form-item-select"
            placeholder="Select"
            size="small"
            @change="onChangeType"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="(value, index) in typeOptions"
              :key="Number(index)"
              :label="value"
              :value="Number(index)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('currency.bind_fait_currency')">
          <el-select
            v-model="temp.bind"
            class="form-item-select"
            placeholder="Select"
            size="small"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="(value, index) in bindFaitCurrencyOptions"
              :key="index.id"
              :label="value.code"
              :value="value.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('currency.status')">
          <el-select
            v-model="temp.status"
            class="form-item-select"
            placeholder="Select"
            size="small"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="(value, index) in statusOptions"
              :key="Number(index)"
              :label="value"
              :value="Number(index)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('currency.icon')"
          class="postInfo-container-item"
        >
          <el-upload
            :data="dataObj"
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeUpload"
            class="image-uploader"
            style="width: 50px"
            drag
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">Upload File</div>
          </el-upload>
          <div class="image-preview">
            <div v-show="imageUrl !== null" class="image-preview-wrapper">
              <img :src="imageUrl" height="80">
              <div class="image-preview-action">
                <i class="el-icon-delete" @click="rmImage" />
              </div>
            </div>
          </div>
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
  currencyList,
  currencyStatusList,
  currencyCreate,
  getCurrency,
  currencyUpdate,
  bindFaitCurrencyStatusList
} from '@/api/currency'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { validNumberic } from '@/utils/validate'

const defaultValueForm = {
  id: undefined,
  name: '',
  symbol: '',
  code: '',
  iso_no: '',
  type: 1,
  status: 1,
  icon: '',
  bind: ''
}

export default {
  components: { Pagination },
  data() {
    const validateNumberic = (rule, value, callback) => {
      if (validNumberic(value)) {
        callback(new Error('Please enter the number only'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        type: 0,
        status: 0,
        name: ''
      },
      loading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        symbol: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        code: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        iso_no: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('form.required')
          },
          { trigger: 'blur', validator: validateNumberic }
        ],
        type: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('form.required')
          }
        ],
        status: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('form.required')
          }
        ]
      },
      temp: defaultValueForm,
      typeOptions: [],
      statusOptions: [],
      bindFaitCurrencyOptions: [],
      tempUrl: '',
      dataObj: { token: '', key: '' },
      imageUrl: null
    }
  },
  created() {
    this.fetchData({})
    this.fetchStatus({})
  },
  methods: {
    fetchData(param) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      currencyList(this.listQuery).then((response) => {
        console.log(response)
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      currencyStatusList().then((response) => {
        console.log(response)
        this.typeOptions = response.data.type
        this.statusOptions = response.data.status
      })
    },
    onSearch() {
      console.log(this.formSearch)
      this.fetchData(this.listQuery)
    },
    resetTemp() {
      this.imageUrl = null
      this.temp = {
        id: undefined,
        name: '',
        symbol: '',
        code: '',
        iso_no: '',
        type: 1,
        status: 1,
        bind: '',
        limit_min_deposit: '',
        limit_min_withdraw: ''
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
    rmImage() {
      this.imageUrl = null
    },
    beforeUpload(file) {
      this.temp.icon = file
      const _self = this
      var reader = new FileReader()
      reader.onload = function(e) {
        _self.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    handleCreate() {
      this.resetTemp()
      this.handleOpenPopup('create')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = new FormData()
          formData.append('name', this.temp.name)
          formData.append('symbol', this.temp.symbol)
          formData.append('code', this.temp.code)
          formData.append('iso_no', this.temp.iso_no)
          formData.append('type', this.temp.type)
          formData.append('bind', this.temp.bind)
          formData.append('status', this.temp.status)
          formData.append('limit_min_deposit', this.temp.limit_min_deposit)
          formData.append('limit_min_withdraw', this.temp.limit_min_withdraw)
          formData.append('icon', this.temp.icon)
          currencyCreate(formData)
            .then((response) => {
              this.handleAfterRequest(response)
              this.loading = false
            })
            .catch((response) => {
              console.log(response)
              this.loading = false
            })
        }
      })
    },
    handleUpdate(row) {
      getCurrency(row.id).then((response) => {
        const item = response.data
        this.imageUrl = item.icon_url
        this.temp = {
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          code: item.code,
          iso_no: item.iso_no,
          type: item.type,
          bind: item.bind,
          status: item.status,
          limit_min_deposit: item.limit_min_deposit,
          limit_min_withdraw: item.limit_min_withdraw
        }
        if (item.type == 3) {
          bindFaitCurrencyStatusList().then((response) => {
            this.bindFaitCurrencyOptions = response.data
          })
        }
        this.handleOpenPopup('update')
      })
    },
    updateData() {
      console.log(99888888)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = new FormData()
          formData.append('name', this.temp.name)
          formData.append('symbol', this.temp.symbol)
          formData.append('code', this.temp.code)
          formData.append('iso_no', this.temp.iso_no)
          formData.append('type', this.temp.type)
          formData.append('bind', this.temp.bind)
          formData.append('status', this.temp.status)
          formData.append('limit_min_deposit', this.temp.limit_min_deposit)
          formData.append('limit_min_withdraw', this.temp.limit_min_withdraw)
          if (this.temp.icon) {
            formData.append('icon', this.temp.icon)
          }
          currencyUpdate(this.temp.id, formData)
            .then((response) => {
              this.handleAfterRequest(response)
              this.loading = false
            })
            .catch((response) => {
              console.log(response)
              this.loading = false
            })
        }
      })
    },
    onChangeType(value) {
      if (value == 3) {
        bindFaitCurrencyStatusList().then((response) => {
          this.bindFaitCurrencyOptions = response.data
        })
      }
    }
  }
}
</script>
