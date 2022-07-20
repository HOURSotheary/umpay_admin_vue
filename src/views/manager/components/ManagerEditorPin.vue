<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="New PIN" prop="pin">
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
        @click="handelAction"
      >
        Confirm
      </el-button>
    </div>
  </div>
</template>
<script>
import { managerUpdatePin } from '@/api/manager'
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
        new_pin: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        pin: ''
      },
      loading: false
    }
  },
  created() {
    if (this.event === 'edit-pin') {
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
      } else if (this.event === 'edit-pin') {
        this.updateData()
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          managerUpdatePin(this.temp.id, this.temp)
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
