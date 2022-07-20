<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="Current Password" prop="current_password">
        <el-input
          v-model="temp.current_password"
          placeholder="Enter"
          show-password
        />
      </el-form-item>
      <el-form-item label="New Password" prop="new_password">
        <el-input
          v-model="temp.new_password"
          placeholder="Enter"
          show-password
        />
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirm_password">
        <el-input
          v-model="temp.confirm_password"
          placeholder="Enter"
          show-password
        />
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
        @click="handelAction"
      >
        Confirm
      </el-button>
    </div>
  </div>
</template>
<script>
import { updateOwnPassword } from '@/api/update-password'
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
      rules: {
        current_password: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        new_password: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        confirm_password: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        current_password: '',
        new_password: '',
        confirm_password: ''
      },
      loading: false
    }
  },
  created() {
    if (this.event === 'edit-own-password') {
      this.temp.id = this.data.id
    }
  },
  methods: {
    fetchData() {
      // this.temp = this.data
    },
    handelAction() {
      if (this.event === 'create') {
        this.createData()
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          updateOwnPassword(this.temp)
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
