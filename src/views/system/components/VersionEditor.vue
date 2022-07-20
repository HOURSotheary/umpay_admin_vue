<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-row>
        <el-form-item :label="$t('version.titles')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('version.number')" prop="number">
          <el-input v-model="temp.number" />
        </el-form-item>
        <el-form-item :label="$t('version.language')" prop="language">
          <div class="block">
            <el-radio-group v-model="temp.language">
              <el-radio :label="1"> English </el-radio>
              <el-radio :label="2"> zh-CN </el-radio>
              <el-radio :label="3"> zh-TW </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item :label="$t('version.must')" prop="must">
          <div class="block">
            <el-radio-group v-model="temp.must">
              <el-radio :label="1"> Yes </el-radio>
              <el-radio :label="2"> No </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item :label="$t('version.release_time')" prop="release_at">
          <el-date-picker
            v-model="temp.release_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="Please select"
            style="width: 100%"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="(value, index) in statusOptions"
              :key="index"
              :label="value"
              :value="index"
            />
          </el-select>
        </el-form-item>
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
import { versionCreate, versionUpdate, versionStatusList } from '@/api/version'

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
        number: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        must: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        language: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        status: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },
      temp: {
        id: '',
        title: '',
        number: '',
        must: '',
        status: undefined,
        language: '',
        release_at: ''
      },
      loading: false,
      statusOptions: [],
      must: null,
      language: null
    }
  },
  created() {
    this.fetchStatus()
    if (this.event === 'edit') {
      this.temp.id = this.data.id
      this.temp.title = this.data.title
      this.temp.number = this.data.number
      this.temp.status = String(this.data.status)
      this.temp.release_at = this.data.release_at
      if (this.data.must === 1) {
        this.temp.must = 1
      } else if (this.data.must === 2) {
        this.temp.must = 2
      }
      if (this.data.language === '1') {
        this.temp.language = 1
      } else if (this.data.language === '2') {
        this.temp.language = 2
      } else if (this.data.language === '3') {
        this.temp.language = 3
      }
    }
  },
  methods: {
    fetchData() {
      // this.temp = this.data
    },
    fetchStatus() {
      versionStatusList().then((response) => {
        console.log(response)
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
          versionCreate(this.temp)
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
          versionUpdate(this.temp.id, this.temp)
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
