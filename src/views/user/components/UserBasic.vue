<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="User Name" prop="name">
        <el-input v-model="temp.name" placeholder="Enter" />
      </el-form-item>
      <el-form-item label="Phone Country" prop="phone_country">
        <el-select
          v-model="temp.phone_country"
          class="form-item-select"
          placeholder="Select"
        >
          <el-option key="" label="All" value="" />

          <el-option
            v-for="(value, index) in phoneCountryOptions"
            :key="index"
            :label="value.phone_code"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="temp.phone" placeholder="Enter" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="temp.email" placeholder="Enter" />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="temp.status"
          class="form-item-select"
          placeholder="Select"
        >
          <el-option key="" label="All" value="" />

          <el-option
            v-for="(value, index) in statusOptions"
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
        @click="updateData"
      >
        Confirm
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  userStatusList,
  userBasic,
  updateUserBasic,
  phoneCountryList
} from '@/api/user'
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
        name: [{ required: true, trigger: 'blur' }],
        phone_country: [{ required: true, trigger: 'blur' }],
        phone: [{ required: true, trigger: 'blur' }]
      },
      title: '',
      temp: {
        id: '',
        name: '',
        phone_country: '',
        phone: '',
        email: '',
        status: 1
      },
      loading: false,
      statusOptions: [],
      phoneCountryOptions: []
    }
  },
  created() {
    this.fetchStatus({})
    if (this.event === 'edit') {
      this.fetchData({})
    }
  },
  methods: {
    fetchData() {
      userBasic(this.data.id).then((response) => {
        this.temp = response.data
      })
    },
    fetchStatus() {
      userStatusList().then((response) => {
        this.statusOptions = response.data.status
      })
      phoneCountryList().then((response) => {
        this.phoneCountryOptions = response.data.lists
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          updateUserBasic(this.temp.id, this.temp)
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
