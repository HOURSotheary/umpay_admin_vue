<template>
  <div class="drawer-container">
    <el-row :gutter="20">
      <div class="label-value-content">
        <span class="label"> <strong> Type </strong></span>
        <span class="value">{{ tableData.type_text }}</span>
      </div>
      <div class="label-value-content">
        <span class="label"><strong> UUID </strong></span>
        <span class="value">{{ tableData.uuid }}</span>
      </div>
      <div class="label-value-content">
        <span class="label"><strong> User Name</strong></span>
        <span class="value">{{ tableData.user_name }}</span>
      </div>
      <div class="label-value-content">
        <span class="label"><strong> First Name</strong></span>
        <span class="value">{{ tableData.first_name }}</span>
      </div>
      <div class="label-value-content">
        <span class="label"><strong> Last Name</strong></span>
        <span class="value">{{ tableData.last_name }}</span>
      </div>
      <div class="label-value-content">
        <span class="label"><strong> Passport Number</strong></span>
        <span class="value">{{ tableData.certificate_number }}</span>
      </div>
      <div class="label-value-content">
        <span class="label"><strong> Birthday</strong></span>
        <span class="value">{{ tableData.birthday }}</span>
      </div>
    </el-row>
    <span>{{ $t('tracking.attachment') }}</span>
    <el-row>
      <div v-show="imageUrll !== null" class="" style="display: flex">
        <div
          v-for="(src, index) in imageUrll"
          :key="index"
          class="pic"

          @click="() => showImg(index)"
        >
          <img :src="src" width="100px">
        </div>
      </div>
      <vue-easy-lightbox
        :visible="visible"
        :imgs="imageUrll"
        :index="index"
        @hide="handleHide"
      />
    </el-row>

    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-form-item label="Approve" prop="status">
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
      >Close</el-button>
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
  userVerifyDetail,
  userVerifyStatusList,
  updateUserVerifyStatus
} from '@/api/user'

export default {
  props: {
    verify: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        status: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      tableKey: '0',
      tableVisable: false,
      tableData: [],
      temp: {
        id: '',
        status: 1
      },
      loading: false,
      imageUrll: '',
      imgs: ['http://via.placeholder.com/350x150', 'http://via.placeholder.com/350x150'],
      statusOptions: [],
      visible: false,
      index: 0 // default: 0
    }
  },
  created() {
    this.tableKey = 'approve-' + this.verify.id
    this.tableVisable = true
    this.fetchData()
    this.fetchStatus()
  },
  methods: {
    fetchData() {
      userVerifyDetail(this.verify.id).then((response) => {
        this.tableData = response.data
        this.temp.id = response.data.id
        this.temp.status = parseInt(response.data.status)
        this.imageUrll = response.data.file_lists
      })
    },
    fetchStatus() {
      userVerifyStatusList().then((response) => {
        this.statusOptions = response.data.status
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            status: this.temp.status
          }

          updateUserVerifyStatus(this.verify.id, data)
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
        this.$message({
          message: ' Successfully!',
          type: 'success'
        })
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
    },
    handleClose() {
      this.tableVisable = false
      this.$parent.closeDrawer()
    },
    showImg(index) {
      this.index = index
      this.visible = true
    },
    handleHide() {
      this.visible = false
    }
  }
}
</script>
