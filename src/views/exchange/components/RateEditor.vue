<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item :label="$t('exchange_rate.from')">
        <el-select
          v-model="temp.from_currency_code"
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
          v-model="temp.to_currency_code"
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

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        :stripe="true"
        size="mini"
      >
        <el-table-column :label="$t('exchange_rate.data_from')">
          <template slot-scope="scope">
            {{ scope.row.data_from }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('exchange_rate.price')">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button
              v-model="row.rate"
              size="big"
              :row="row"
              @click="copyCode"
            >Input</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="Rate" prop="rate">
        <el-input v-model="temp.rate" placeholder="Enter" />
      </el-form-item>
      <el-form-item label="PIN" prop="pin">
        <el-input v-model="temp.pin" placeholder="Enter" show-password />
      </el-form-item>
    </el-form>
    <div slot="footer" class="drawer-footer">
      <el-button
        :loading="loading"
        type="primary"
        size="small"
        @click="handelAction"
      >
        Confirm
      </el-button>

      <el-button
        size="small"
        @click="this.$parent.closeDrawer"
      >Cancel</el-button>
    </div>
  </div>
</template>
<script>
import { exchangeRateStore, marketPriceList } from '@/api/exchange'
import { currencyListOption } from '@/api/currency'

export default {
  props: {
    event: {
      type: String,
      default: 'create'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      rules: {
        from_currency_code: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        to_currency_code: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        rate: [{ required: true, trigger: 'blur' }],
        pin: [{ required: true, trigger: 'blur' }]
      },
      temp: {
        id: '',
        from_currency_code: '',
        to_currency_code: '',
        rate: '',
        pin: ''
      },
      loading: false,
      statusOptions: [],
      currencyOptions: []
    }
  },
  created() {
    this.fetchStatus()
    if (this.event === 'edit') {
      this.temp.id = this.data.id
      this.temp.from_currency_code = this.data.from_currency_code
      this.temp.to_currency_code = this.data.to_currency_code
      this.temp.rate = Number(this.data.rate)
      this.temp.pin = this.data.pin
    }
  },
  methods: {
    onChange() {
      this.fetchData(this.temp)
    },
    copyCode: async function(e) {
      this.temp.rate = e.target.value
    },
    fetchData(param) {
      marketPriceList(param).then((response) => {
        this.list = response.data
      })
    },

    fetchStatus() {
      currencyListOption().then((response) => {
        this.currencyOptions = response.data
      })
    },
    handelAction() {
      if (this.event === 'create') {
        this.createData()
      } else if (this.event === 'edit') {
        this.updateData()
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          exchangeRateStore(this.temp)
            .then((response) => {
              this.handleAfterRequest(response)
              this.loading = false
            })
            .catch((response) => {
              this.loading = false
            })
        }
      })
    },
    handleAfterRequest(response) {
      if (response.status === 200) {
        this.$message({ message: ' Successfully!', type: 'success' })
        this.$parent.closeDrawer()
      } else {
        let messageError = ''
        Object.keys(response.data).forEach(function(key) {
          messageError += '\n' + response.data[key][0]
        })
        this.$message({
          message: ' Failed!' + '\n' + messageError,
          type: 'warning'
        })
      }
    }
  }
}
</script>
