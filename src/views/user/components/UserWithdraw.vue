<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="Currency Code">
        <el-select
          v-model="temp.currency_code"
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
      <el-form-item label="Amount" prop="amount">
        <el-input
          v-model="temp.amount"
          type="number"
          oninput="if(this.value < 0) this.value = 0;"
          placeholder="Enter"
        />
      </el-form-item>
      <el-form-item label="PIN" prop="pin">
        <el-input v-model="temp.pin" placeholder="Enter" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="drawer-footer">
      <el-button
        size="small"
        @click="this.$parent.closeDrawer"
      >Cancel</el-button>
      <el-button
        :loading="loading"
        type="primary"
        size="small"
        @click="updateData"
      >
        Confirm
      </el-button>
    </div>
  </div>
</template>
<script>
import { withdrawStore } from '@/api/finance'
import { currencyListOption } from '@/api/currency'
export default {
  props: {
    event: {
      type: String,
      default: 'create'
    },
    parmas: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      rules: {
        currency_code: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        amount: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        pin: [{ required: true, trigger: 'blur' }]
      },
      title: '',
      temp: {
        user_id: '',
        currency_code: '',
        amount: '',
        pin: ''
      },
      loading: false,
      currencyOptions: []
    }
  },
  created() {
    this.fetchStatus({})
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.temp.user_id = this.parmas.id
          console.log('data ' + JSON.stringify(this.temp))
          withdrawStore(this.temp)
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
    fetchStatus() {
      currencyListOption().then((response) => {
        this.currencyOptions = response.data
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
