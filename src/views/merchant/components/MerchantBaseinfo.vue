<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="Merchant Name" prop="name">
        <el-input v-model="temp.name" placeholder="Enter" />
      </el-form-item>
      <el-form-item label="Transaction Description" prop="description">
        <el-input
          v-model="temp.description"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Enter"
        />
      </el-form-item>
      <el-form-item :label="$t('merchant.gateway_enable')" prop="gateway">
        <el-select
          v-model="temp.gateway"
          placeholder="Enter"
          class="form-item-select"
        >
          <el-option key="" label="All" value="" />
          <el-option
            v-for="(value, index) in gatewayOptions"
            :key="index"
            :label="value"
            :value="parseInt(index)"
          />
        </el-select>
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
        @click="handleSubmit"
      >
        Confirm
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  merchantBaseInfoStore,
  merchantStatusList,
  merchantBaseInfo
} from '@/api/merchant'
export default {
  props: {
    event: {
      type: String,
      default: 'create'
    },
    data: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        description: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        gateway: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        id: '',
        name: '',
        description: '',
        gateway: ''
      },
      loading: false,
      gatewayOptions: []
    }
  },
  created() {
    // console.log(this.data)
    this.fetchStatus({})
    this.fetchData({})
  },
  methods: {
    fetchData() {
      merchantBaseInfo(this.data.id).then((response) => {
        this.temp = response.data
      })
    },
    handleSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          merchantBaseInfoStore(this.temp.id, this.temp)
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
      merchantStatusList().then((response) => {
        this.gatewayOptions = response.data.gateway
        console.log(this.gatewayOptions)
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
