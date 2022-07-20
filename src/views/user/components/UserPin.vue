<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="New Pin" prop="pin">
        <el-input v-model="temp.pin" placeholder="Enter" show-password />
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
import { updateUserPin } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        pin: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        id: '',
        pin: ''
      },
      loading: false
    }
  },
  created() {},
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          updateUserPin(this.user.id, this.temp)
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
