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
          <div class="label-value-content">
            <span class="label"><strong> UUID </strong></span>
            <span class="value">{{ data.uuid }}</span>
          </div>
          <el-form-item label="Certificate Number" prop="certificate_number">
            <el-input
              v-model="temp.certificate_number"
              placeholder="Certificate Number"
            />
          </el-form-item>
          <el-form-item label="First Name" prop="first_name">
            <el-input v-model="temp.first_name" placeholder="First Name" />
          </el-form-item>
          <el-form-item label="BirthDay" prop="birthday">
            <el-col :span="24">
              <el-date-picker
                v-model="temp.birthday"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Pick a date"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="Certificate Files" class="postInfo-container-item">
            <el-upload
              ref="upload"
              :multiple="true"
              :file-list="fileList"
              :show-file-list="true"
              :before-upload="beforeUpload"
              class="editor-slide-upload"
              action="https://httpbin.org/post"
              list-type="picture-card"
            >
              <el-button size="small" type="primary"> Click upload </el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="label-value-content">
            <span class="label"><strong> User Name </strong></span>
            <span class="value">{{ data.user_name }}</span>
          </div>
          <el-form-item label="Certificate Type" prop="certificate_type">
            <el-select
              v-model="temp.certificate_type"
              class="form-item-select"
              placeholder="Select Certificate Type"
            >
              <el-option key="" label="All" value="" />
              <el-option
                v-for="(value, index) in certificateTypeOptions"
                :key="index"
                :label="value"
                :value="parseInt(index)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Last Name" prop="last_name">
            <el-input v-model="temp.last_name" placeholder="Last Name" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="drawer-footer">
      <el-button size="small" @click="handleClose">Cancel</el-button>
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
import { userVerifyStatusList, userVerifyUpdate } from '@/api/user'

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
        type: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        certificate_type: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        certificate_number: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        first_name: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        last_name: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        status: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        birthday: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        id: '',
        type: undefined,
        certificate_type: undefined,
        status: undefined,
        certificate_number: '',
        first_name: '',
        last_name: '',
        birthday: '',
        portrait_photo: 1,
        files: 1
      },
      loading: false,
      certificateTypeOptions: [],
      typeOptions: [],
      statusOptions: [],
      fileList: []
    }
  },
  created() {
    this.fetchStatus()
    if (this.event === 'edit') {
      console.log(this.data)
      this.temp.id = this.data.id
      this.temp.certificate_number = this.data.certificate_number
      this.temp.first_name = this.data.first_name
      this.temp.last_name = this.data.last_name
      this.temp.birthday = this.data.birthday
      this.temp.certificate_type = Number(this.data.certificate_type)
      this.temp.type = Number(this.data.type)
      this.temp.status = Number(this.data.status)
    }
  },
  methods: {
    fetchData() {
      // this.temp = this.data
    },
    fetchStatus() {
      userVerifyStatusList().then((response) => {
        this.certificateTypeOptions = response.data.certificate_type
        this.typeOptions = response.data.type
        this.statusOptions = response.data.status
      })
    },
    handelAction() {
      if (this.event === 'create') {
        this.createData()
      } else if (this.event === 'edit') {
        this.updateData()
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = new FormData()
          this.fileList = this.$refs.upload.uploadFiles
          this.fileList.forEach((el) => {
            formData.append('certificate_files[]', el.raw)
          })

          formData.append('certificate_number', this.temp.certificate_number)
          formData.append('certificate_type', this.temp.certificate_type)
          formData.append('first_name', this.temp.first_name)
          formData.append('last_name', this.temp.last_name)
          formData.append('birthday', this.temp.birthday)
          userVerifyUpdate(this.temp.id, formData)
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
    },
    beforeUpload(file) {
      const _self = this
      var reader = new FileReader()
      reader.onload = function(e) {
        _self.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    handleClose() {
      this.$parent.closeDrawer()
    }
  }
}
</script>
