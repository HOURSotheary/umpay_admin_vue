<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('appeal.appeal') }}</div>
        <div class="box-card-header-options">
          <el-button
            size="mini"
            type="default"
            @click="handleBack"
          >Back</el-button>
        </div>
      </div>
      <div class="filter-container" style="">
        <el-form :key="value" :inline="true" size="small" label-width="110px">
          <span><strong>{{ $t('tracking.base') }}</strong></span>
          <el-row v-if="tableData.base">
            <el-col :span="24">
              <el-form-item :label="$t('tracking.no')" style="width: 30%">
                {{ tableData.base.number }}
              </el-form-item>
              <el-form-item label="Type :">
                <span>{{ tableData.base.type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('tracking.foreign_no')" style="width: 30%">
                {{ tableData.base.foreign_no }}
              </el-form-item>
              <el-form-item :label="$t('tracking.status')">
                {{ tableData.base.status_text }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('tracking.buyer_uuid')" style="width: 30%">
                {{ tableData.base.buyer_uuid }}
              </el-form-item>
              <el-form-item :label="$t('tracking.seller_uuid')">
                {{ tableData.base.seller_uuid }}
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item :label="$t('tracking.create_at')" style="width: 30%">
                {{ tableData.base.created_at }}
              </el-form-item>
              <el-form-item :label="$t('tracking.update_at')">
                {{ tableData.base.updated_at }}
              </el-form-item>
            </el-col>
          </el-row>
          <span><strong>{{ $t('tracking.description') }}</strong></span>
          <el-row v-if="tableData">
            <br>
            <span>{{ tableData.description }} </span>
          </el-row>
          <br>
          <span><strong>{{ $t('tracking.attachment') }}</strong></span>
          <el-row>
            <!--<div class="image-preview">
              <div v-show="imageUrll !== null" class="image-preview-wrapper">
                <div
                  v-for="value in imageUrll"
                  :key="value"
                  class="content"
                  style="display: inline-block"
                >
                  <img :src="value" height="80">
                </div>
              </div>
            </div>-->
            <div v-show="imageUrll !== null" class="" style="display: flex">
              <div
                v-for="(src, index) in imageUrll"
                :key="index"
                class="pic"

                @click="() => showImg(index)"
              >
                <img :src="src" width="100%">
              </div>
            </div>
            <vue-easy-lightbox
              :visible="visible"
              :imgs="imageUrll"
              :index="index"
              @hide="handleHide"
            />
          </el-row>
          <br>
          <div
            v-show="temp.status === 3 || temp.status === 4"
            style="background-color: #eee; padding: 20px; width: 40%"
          >
            <span><strong>{{ $t('tracking.manager') }}</strong></span>
            <br>
            <el-row v-if="tableData.manager">
              <el-form-item label="">
                {{ tableData.manager.admin_name }}
              </el-form-item>
              <el-form-item label="">
                <span>{{ tableData.manager.solved_at }}</span>
              </el-form-item>
              <br>
              <el-form-item label="">
                {{ tableData.manager.solution_remark }}
              </el-form-item>
              <br>
              <el-form-item label="">
                <el-row>
                  <div class="image-preview">
                    <div
                      v-show="tableData.manager.solution_attachments !== null"
                      class="image-preview-wrapper"
                    >
                      <div
                        v-for="value in tableData.manager.solution_attachments"
                        :key="value"
                        class="content"
                        style="display: inline-block"
                      >
                        <img :src="value" height="80">
                      </div>
                    </div>
                  </div>
                </el-row>
              </el-form-item>
            </el-row>
          </div>
        </el-form>
      </div>

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="top"
        size="small"
      >
        <el-form-item
          v-show="temp.status === 1 || temp.status === 2"
          :label="$t('tracking.remark')"
          prop="solution_remark"
        >
          <el-input
            v-model="temp.solution_remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Enter"
          />
        </el-form-item>
        <el-form-item :label="$t('tracking.attachment')" class="postInfo-container-item">
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
        <el-form-item
          label-width="180px"
          :label="$t('tracking.status')"
          class="postInfo-container-item"
          prop="status"
        >
          <div class="block">
            <el-radio-group v-model="temp.status">
              <el-radio :label="1"> pending </el-radio>
              <el-radio :label="2"> tracking </el-radio>
              <el-radio :label="3"> solved </el-radio>
              <el-radio :label="4"> cancelled </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          v-show="temp.status === 3"
          :label="$t('appeal.solution')"
          prop="solution"
        >
          <el-select
            v-model="temp.solution"
            placeholder="Enter"
            class="form-item-select"
          >
            <el-option key="" label="All" value="" />
            <el-option
              v-for="(value, index) in solutionOptions"
              :key="index"
              :label="value"
              :value="index"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('tracking.manager_pin')" prop="pin">
          <el-input v-model="temp.pin" placeholder="Enter" show-password />
        </el-form-item>
        <div class="box-card-footer clearfix" style="margin-top: 20px">
          <el-button
            :loading="loading"
            type="primary"
            size="small"
            @click="handelAction"
          >
            Confirm
          </el-button>
        </div>
      </el-form></el-card>
  </div>
</template>
<script>
import { appearDetail, appearUpdate, appealStatusList } from '@/api/appear'

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
        pin: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ],
        solution: [
          { required: true, trigger: 'blur', message: this.$t('form.required') }
        ]
      },

      temp: {
        id: '',
        solution_remark: '',
        pin: '',
        status: '',
        solution: ''
      },
      loading: false,
      allSelected: false,
      status: null,
      dataObj: { token: '', key: '' },
      imageUrl: [],
      tableData: [],
      selected: null,
      solutionOptions: [],
      attachments: [],
      listObj: {},
      fileList: [],
      value: '',
      imageUrll: '',
      imgs: ['http://via.placeholder.com/350x150', 'http://via.placeholder.com/350x150'],
      visible: false,
      index: 0 // default: 0
    }
  },

  created() {
    this.fetchStatus({})
    const id = this.$route.params.id
    appearDetail(id)
      .then((response) => {
        this.tableData = response.data
        this.imageUrll = response.data.attachments
        if (this.tableData.base.status === 1) {
          this.temp.status = 1
        } else if (this.tableData.base.status === 2) {
          this.temp.status = 2
        } else if (this.tableData.base.status === 3) {
          this.temp.status = 3
        } else if (this.tableData.base.status === 4) {
          this.temp.status = 4
        }
      })
      .catch((response) => {
        this.loading = false
      })
  },
  methods: {
    fetchData() {},
    fetchStatus() {
      appealStatusList().then((response) => {
        this.solutionOptions = response.data.solution
      })
    },
    handelAction() {
      this.createData()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = new FormData()
          formData.append('status', this.temp.status)
          this.fileList = this.$refs.upload.uploadFiles
          this.fileList.forEach((el) => {
            formData.append('solution_attachments[]', el.raw)
          })

          formData.append('pin', this.temp.pin)
          formData.append('solution', this.temp.solution)
          formData.append('solution_remark', this.temp.solution_remark)

          const id = this.$route.params && this.$route.params.id
          appearUpdate(id, formData)
            .then((response) => {
              this.handleAfterRequest(response)
              this.loading = false
            })
            .catch((response) => {
              console.log(response)
              this.loading = false
            })
        }
      })
    },
    handleAfterRequest(response) {
      if (response.status === 200) {
        this.$message({ message: ' Successfully!', type: 'success' })
        this.$router.push('/operation/appeal/index')
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
    rmImage() {
      this.imageUrl = null
    },
    beforeUpload(file) {
      const _self = this
      var reader = new FileReader()
      reader.onload = function(e) {
        _self.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    handleBack() {
      this.$router.push('/operation/appeal/index')
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

<style>
.rtl {
  width: 70% !important;
}
.pic{
  padding: 5px;
  width:10%;
}
</style>
