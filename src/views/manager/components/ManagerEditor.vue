<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Role" prop="admin_role_id">
            <el-select
              v-model="temp.admin_role_id"
              class="form-item-select"
              placeholder="Select"
            >
              <el-option key="" label="All" value="" />

              <el-option
                v-for="(value, index) in roleOptions"
                :key="index"
                :label="value.name"
                :value="value.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="temp.email" placeholder="Enter" />
          </el-form-item>
          <el-form-item label="Login Password" prop="password">
            <el-input
              v-model="temp.password"
              placeholder="Enter"
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Name" prop="name">
            <el-input v-model="temp.name" placeholder="Enter" />
          </el-form-item>
          <el-form-item label="Pin" prop="pin">
            <el-input v-model="temp.pin" placeholder="Enter" />
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
        </el-col>
      </el-row>

      <el-form-item label="Description" prop="description">
        <el-input
          v-model="temp.description"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Enter"
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
import {
  managerStatusList,
  managerCreate,
  managerUpdate,
  managerDetail
} from '@/api/manager'
import { roleList } from '@/api/role'
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
        name: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        email: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        admin_role_id: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
        // password: [{ required: true, trigger: 'blur' }],
        // pin: [{ required: true, trigger: 'blur' }]
      },
      temp: {
        id: '',
        admin_role_id: '',
        password: '',
        pin: '',
        name: '',
        email: '',
        description: '',
        status: 1
      },
      loading: false,
      roleOptions: [],
      statusOptions: []
    }
  },
  created() {
    this.fetchStatus()
    if (this.event === 'edit') {
      managerDetail(this.data.id).then((response) => {
        this.temp.id = response.data.id
        this.temp.name = response.data.name
        this.temp.email = response.data.email
        this.temp.admin_role_id = response.data.role_name
        this.temp.status = Number(response.data.status)
        this.temp.description = response.data.description
      })
    }
  },
  methods: {
    fetchData() {
      // this.temp = this.data
    },
    fetchStatus() {
      managerStatusList().then((response) => {
        this.statusOptions = response.data.status
      })
      roleList().then((response) => {
        this.roleOptions = response.data.lists
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
          managerCreate(this.temp)
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          managerUpdate(this.temp.id, this.temp)
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

<style>
.rtl {
  width: 50% !important;
}
</style>
