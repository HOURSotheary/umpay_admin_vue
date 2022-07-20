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
          <el-form-item label="Title" prop="title">
            <el-input v-model="temp.title" placeholder="Enter Title" />
          </el-form-item>
          <el-form-item label="Page" prop="page">
            <el-select
              v-model="temp.page"
              class="form-item-select"
              placeholder="Select Page"
            >
              <el-option key="" label="All" value="" />

              <el-option
                v-for="(value, index) in pageOptions"
                :key="index"
                :label="value"
                :value="parseInt(index)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="URL" prop="url">
            <el-input v-model="temp.url" placeholder="Enter Url" />
          </el-form-item>

          <el-form-item
            label-width="180px"
            label="Push:"
            class="postInfo-container-item"
            prop="push"
          >
            <div class="block">
              <el-radio-group v-model="temp.push">
                <el-radio :label="0"> No </el-radio>
                <el-radio :label="1"> Yes </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Language" prop="language">
            <el-select
              v-model="temp.language"
              class="form-item-select"
              placeholder="Select Languages"
            >
              <el-option key="" label="All" value="" />

              <el-option
                v-for="(value, index) in languagesOptions"
                :key="index"
                :label="value"
                :value="parseInt(index)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Status" prop="status">
            <el-select
              v-model="temp.status"
              class="form-item-select"
              placeholder="Select Status"
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
          <el-form-item label="Release Time" prop="release_time">
            <el-date-picker
              v-model="temp.release_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label-width="180px"
            label="SMS:"
            class="postInfo-container-item"
            prop="sms"
          >
            <div class="block">
              <el-radio-group v-model="temp.sms">
                <el-radio :label="0"> No </el-radio>
                <el-radio :label="1"> Yes </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label-width="180px"
            label="Link To:"
            class="postInfo-container-item"
            prop="link"
          >
            <div class="block">
              <el-radio-group v-model="temp.link">
                <el-radio :label="0"> None </el-radio>
                <el-radio :label="1"> Internal </el-radio>
                <el-radio :label="2"> Web </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="Content"
            class="postInfo-container-item"
            prop="content"
          >
            <el-input
              v-model="temp.content"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="Enter Content"
            />
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
import { broadcastCreate, broadcastUpdate } from '@/api/broadcast'
import { languagesList, pagesList, statusList } from '@/api/status-option'

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
        title: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        content: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        push: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        sms: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        link: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        status: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        language: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        url: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        release_time: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        page: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        id: '',
        title: '',
        content: '',
        push: '',
        sms: '',
        link: '',
        status: undefined,
        language: undefined,
        url: '',
        release_time: '',
        page: undefined
      },
      loading: false,
      languagesOptions: [],
      statusOptions: [],
      pageOptions: [],
      push: null,
      sms: null,
      link: null
    }
  },
  created() {
    this.fetchStatus()
    if (this.event === 'edit') {
      this.temp.id = this.data.id
      this.temp.title = this.data.title
      this.temp.url = this.data.url
      this.temp.content = this.data.content
      this.temp.language = Number(this.data.language)
      this.temp.page = Number(this.data.page)
      this.temp.status = Number(this.data.status)
      this.temp.release_time = this.data.release_time
      if (this.data.push === 0) {
        this.temp.push = 0
      } else if (this.data.push === 1) {
        this.temp.push = 1
      }
      if (this.data.sms === 0) {
        this.temp.sms = 0
      } else if (this.data.sms === 1) {
        this.temp.sms = 1
      }
      if (this.data.link === 0) {
        this.temp.link = 0
      } else if (this.data.link === 1) {
        this.temp.link = 1
      } else if (this.data.link === 2) {
        this.temp.link = 2
      }
    }
  },
  methods: {
    fetchData() {
      // this.temp = this.data
    },
    fetchStatus() {
      languagesList().then((response) => {
        this.languagesOptions = response.data.language
      })
      pagesList().then((response) => {
        this.pageOptions = response.data.pages
      })
      statusList().then((response) => {
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          broadcastCreate(this.temp)
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
          broadcastUpdate(this.temp.id, this.temp)
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
    handleClose() {
      this.$parent.closeDrawer()
    }
  }
}
</script>
<style>
.rtl {
  width: 50% !important;
}
</style>
