<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">Payment Field</div>
        <div class="box-card-header-options">
          <el-button
            size="mini"
            type="secondary"
            @click="handleBack"
          >Back</el-button>
        </div>
      </div>

      <div class="createPost-container">
        <div class="drawer-container">
          <el-form
            ref="dataForm"
            :rules="rules.rows"
            label-position="top"
            size="small"
          >
            <el-row style="margin-bottom: 20px">
              <el-col :span="12">
                <div v-for="(item, key) in listData" :key="key">
                  {{ item.name }}
                </div>
              </el-col>

              <el-col :span="12">
                <el-button
                  v-loading="loading"
                  style="float: right"
                  type="success"
                  size="small"
                  @click="addTableRow"
                >
                  Add
                </el-button>
              </el-col>
            </el-row>
            <div v-for="(row, k) in rows" :key="k">
              <el-row :gutter="20">
                <el-col :span="4">
                  <el-form-item
                    label-width="120px"
                    label="Type:"
                    class="postInfo-container-item"
                    prop="type"
                  >
                    <el-select
                      v-model="row.type"
                      class="filter-item"
                      placeholder="Please select"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in paymentTypeOptions"
                        :key="item.key"
                        :label="item.display_name"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="Name" prop="name">
                    <el-input v-model="row.name" placeholder="Enter" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="Languages Tag" prop="language_tag">
                    <el-input v-model="row.language_tag" placeholder="Enter" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="Limit Min" prop="limit_min">
                    <el-input v-model="row.limit_min" placeholder="Enter" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item label="Limit Max" prop="limit_max">
                    <el-input v-model="row.limit_max" placeholder="Enter" />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label="Required" prop="required">
                    <input v-model="row.required" type="checkbox" value="1">
                    <label for="yes">Yes</label>
                  </el-form-item>
                </el-col>

                <el-col :span="2">
                  <el-form-item label="Action" prop="">
                    <el-button
                      v-loading="loading"
                      type="danger"
                      @click="removeItem(row, k)"
                    >
                      Delete
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div slot="footer">
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
      </div>
    </el-card>
  </div>
</template>

<script>
const paymentTypeOptions = [
  { key: '1', display_name: 'Input Number' },
  { key: '2', display_name: 'Input Text' },
  { key: '3', display_name: 'Input Email' },
  { key: '4', display_name: 'Upload Image' }
]

import { getPaymentField, paymentFieldUpdate } from '@/api/payment_field'

export default {
  props: {
    event: {
      type: String,
      default: 'edit'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        rows:
          {
            type: [{ required: true, trigger: 'blur' }],
            name: [{ required: true, trigger: 'blur' }],
            language_tag: [{ required: true, trigger: 'blur' }],
            limit_min: [{ required: true, trigger: 'blur' }],
            limit_max: [{ required: true, trigger: 'blur' }]
          }

      },
      rows: [
        // {
        //   type: '',
        //   name: '',
        //   language_tag: '',
        //   limit_min: '',
        //   limit_max: '',
        //   required: ''
        // }
      ],
      loading: false,
      paymentTypeOptions,
      listData: {},
      tmp: []
    }
  },
  required: 1,
  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      getPaymentField(id)
        .then((response) => {
          this.listData = response
          this.listData.data.fields.forEach((value, index) => {
            console.log(index)
            console.log(value.type_text)
            this.rows.push({
              type: String(value.type),
              name: value.name,
              language_tag: value.language_tag,
              limit_min: value.limit_min,
              limit_max: value.limit_max,
              required: value.required,
              id: value.id
            })
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handelAction() {
      if (this.event === 'create') {
        this.createData()
      } else if (this.event === 'edit') {
        const id = this.$route.params && this.$route.params.id
        this.updateData(id)
      }
    },
    createData() {},

    updateData(id) {
      /* this.$refs['dataForm'].validate((valid) => {
        console.log(111)
        if (valid) {
          console.log(222)
        }
      })*/
      const data = {
        del_ids: this.tmp,
        payment_items: this.rows
      }
      paymentFieldUpdate(id, data)
        .then((response) => {
          this.handleAfterRequest(response)
          this.loading = false
        })
        .catch((response) => {
          this.loading = false
        })
    },
    handleAfterRequest(response) {
      if (response.status === 200) {
        this.$message({ message: ' Successfully!', type: 'success' })
        this.$router.push('/system/payment/index')
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
    addTableRow() {
      this.rows.push({
        type: '',
        name: '',
        language_tag: '',
        limit_min: '',
        limit_max: '',
        required: '',
        id: ''
      })
    },

    removeItem(row, k) {
      this.rows.splice(k, 1)
      this.tmp.push(row.id)
      console.log(this.tmp)
      return this.tmp
    },
    handleBack() {
      this.$router.push('/system/payment/index')
    }
  }
}
</script>
