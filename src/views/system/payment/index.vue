<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('payment.title') }}</div>
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
          size="mini"
          label-width="120px"
        >
          <el-form-item :label="$t('payment.name')" prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="Enter"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>

          <el-form-item :label="$t('manager.status')" prop="status">
            <el-select
              v-model="listQuery.status"
              placeholder="Select"
              clearable
              class="filter-item"
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

          <el-form-item>
            <el-button
              type="primary"
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
        <el-table-column :label="$t('payment.icon')">
          <template slot-scope="scope">
            <el-image
              style="width: 20px; height: 20px"
              :src="scope.row.icon_url"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('payment.name')">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('payment.status')" class-name="status-col">
          <template slot-scope="scope">
            {{ scope.row.status_text }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('payment.currency')">
          <template slot-scope="scope">
            {{ scope.row.currency_codes_text }}
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
        label-width="150px"
        size="small"
      >
        <el-form-item :label="$t('payment.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('payment.status')">
          <el-select
            v-model="temp.status"
            class="form-item-select"
            placeholder="Select"
          >
            <el-option key="" :label="$t('select')" value="" />

            <el-option
              v-for="(value, index) in statusOptions"
              :key="index"
              :label="value"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('payment.currency')">
          <el-select
            v-model="temp.currency_codes"
            multiple
            :filterable="true"
            class="form-item-select"
            placeholder="Select"
          >
            <el-option key="" :label="$t('form.select')" value="" />
            <el-option
              v-for="(value, index) in currencyOptions"
              :key="index"
              :label="value.code"
              :value="value.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('payment.country')" prop="country">
          <el-select
            v-model="temp.country"
            :filterable="true"
            class="form-item-select"
            placeholder="Select"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="(value, index) in phoneCountryOptions"
              :key="index"
              :label="value.name"
              :value="value.phone_code"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('payment.bg_color')" prop="bg_color">
          <el-input v-model="temp.bg_color" />
        </el-form-item>
        <el-form-item :label="$t('payment.code')" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>

        <el-form-item
          :label="$t('payment.icon')"
          class="postInfo-container-item"
        >
          <div class="image-preview">
            <div v-show="imageUrl !== null" class="image-preview-wrapper">
              <img :src="imageUrl" height="128">
              <div class="image-preview-action">
                <i class="el-icon-delete" @click="rmImage" />
              </div>
            </div>
          </div>
          <el-upload
            :data="dataObj"
            action=""
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeUpload"
            class="image-uploader"
            drag
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">Upload File</div>
          </el-upload>
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
  paymentList,
  paymentCreate,
  getPayment,
  paymentUpdate,
  paymentStatusList,
  currencyList
} from '@/api/payment'
import { phoneCountryList } from '@/api/user'

import OperateOptions from '@/components/OperateOptions'
import Pagination from '@/components/Pagination'

const defaultValueForm = {
  id: 0,
  name: '',
  status: 1,
  icon: '',
  bg_color: '',
  code: '',
  currency_codes: [],
  country: ''
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
        limit: 20,
        status: '',
        name: ''
      },
      operateOptions: [],
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
        status: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('form.required')
          }
        ]
      },
      temp: defaultValueForm,
      statusOptions: [],
      currencyOptions: [],
      tempUrl: '',
      dataObj: { token: '', key: '' },
      imageUrl: null,
      currency_codes: [],
      phoneCountryOptions: []
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
      paymentList(this.listQuery).then((response) => {
        this.list = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    },
    fetchStatus() {
      paymentStatusList().then((response) => {
        this.statusOptions = response.data.status
      })
      currencyList().then((response) => {
        this.currencyOptions = response.data
      })
      phoneCountryList().then((response) => {
        this.phoneCountryOptions = response.data.lists
      })
    },
    onSearch() {
      this.fetchData(this.listQuery)
    },
    resetTemp() {
      this.imageUrl = null
      this.temp = {
        id: '',
        name: '',
        status: '',
        currency_codes: ''
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
          formData.append('status', this.temp.status)
          formData.append('icon', this.temp.icon)
          formData.append('bg_color', this.temp.bg_color)
          formData.append('code', this.temp.code)
          formData.append('currency_codes', this.temp.currency_codes)
          formData.append('country', this.temp.country)
          paymentCreate(formData)
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
    handleAction(event, row) {
      if (event === 'edit') {
        this.handleUpdate(row)
      } else if (event === 'field') {
        this.$router.push('/system/payment_field/edit/' + row.id)
      }
    },
    handleUpdate(row) {
      getPayment(row.id).then((response) => {
        const item = response.data
        this.imageUrl = item.icon_url
        this.temp = {
          id: item.id,
          name: item.name,
          bg_color: item.bg_color,
          code: item.code,
          currency_codes: item.currency_codes_text.split(','),
          status: item.status.toString(),
          country: item.country
        }
        console.log(this.temp.currency_codes)
        this.handleOpenPopup('update')
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = new FormData()
          formData.append('name', this.temp.name)
          formData.append('country', this.temp.country)
          formData.append('status', this.temp.status)
          formData.append('bg_color', this.temp.bg_color)
          formData.append('code', this.temp.code)
          if (this.temp.icon) {
            formData.append('icon', this.temp.icon)
          }
          console.log('currency: ' + this.temp.currency_codes)
          formData.append('currency_codes', this.temp.currency_codes)
          paymentUpdate(this.temp.id, formData)
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
    }
  }
}
</script>
