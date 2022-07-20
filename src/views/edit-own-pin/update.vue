<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="Current PIN" prop="current_pin">
        <el-input
          v-model="temp.current_pin"
          placeholder="Enter"
          show-password
        />
      </el-form-item>
      <el-form-item label="New PIN" prop="new_pin">
        <el-input v-model="temp.new_pin" placeholder="Enter" show-password />
      </el-form-item>
      <el-form-item label="Confirm PIN" prop="confirm_pin">
        <el-input
          v-model="temp.confirm_pin"
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
import { updateOwnPin } from '@/api/update-own-pin'
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
        current_pin: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        new_pin: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        confirm_pin: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        current_pin: '',
        new_pin: '',
        confirm_pin: ''
      },
      loading: false
    }
  },
  created() {
    if (this.event === 'edit-own-pin') {
      this.temp.id = this.data.id
    }
  },
  methods: {
    handelAction() {
      if (this.event === 'create') {
        this.createData()
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          updateOwnPin(this.temp)
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
