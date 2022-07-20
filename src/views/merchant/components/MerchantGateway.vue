<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="Access Key" prop="access_key">
        <el-input v-model="temp.access_key" placeholder="Enter" disabled />
      </el-form-item>
      <el-form-item label="Secret Key" prop="secret_key">
        <el-input v-model="temp.secret_key" placeholder="Enter" disabled />
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
        Renew
      </el-button>
    </div>
  </div>
</template>
<script>
import { merchantGateWayStore, merchantGateway } from '@/api/merchant'
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
      rules: {},
      temp: {
        id: ''
      },
      loading: false
    }
  },
  created() {
    this.fetchStatus({})
    this.fetchData({})
  },
  methods: {
    fetchData() {
      merchantGateway(this.data.id).then((response) => {
        this.temp = response.data
      })
    },
    handleSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          merchantGateWayStore(this.data.id)
            .then((response) => {
              const item = response.data
              this.temp = {
                access_key: item.access_key,
                secret_key: item.secret_key
              }

              this.loading = false
            })
            .catch((response) => {
              this.loading = false
            })
        }
      })
    },
    fetchStatus() {},
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

<style>
.rtl {
  width: 35% !important;
}
</style>
