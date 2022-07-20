<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('rule.title') }}</div>
        <div class="box-card-header-options">
          <el-button
            size="mini"
            type="default"
            @click="handleBack"
          >Back</el-button>
        </div>
      </div>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="top"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="temp.name" placeholder="Enter" />
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
        <input v-model="allSelected" type="checkbox" @click="selectAll">
        Select All

        <el-table
          :data="menuList"
          element-loading-text="Loading"
          border
          fit
          :stripe="true"
          size="mini"
        >
          <el-table-column label="Module" width="230">
            <template slot-scope="scope">
              <el-checkbox-group v-model="options_selected">
                <el-checkbox
                  v-show="scope.row.modulesId"
                  :key="scope.row.modulesId"
                  :label="scope.row.modulesId"
                >
                  {{ scope.row.modules }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column label="Page" width="230">
            <template slot-scope="scope">
              <el-checkbox-group v-model="options_selected">
                <el-checkbox
                  :key="scope.row.pagesId"
                  :label="scope.row.pagesId"
                  :value="scope.row.pagesId"
                >
                  {{ scope.row.pages }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column label="Options">
            <template slot-scope="scope">
              <el-checkbox-group v-model="options_selected">
                <el-checkbox
                  v-for="item in scope.row.optionn"
                  :key="item.id"
                  :value="item.id"
                  :label="item.id"
                >
                  {{ item.title }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
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
    </el-card>
  </div>
</template>
<script>
import { managerStatusList } from '@/api/manager'
import { getMenuSidebar } from '@/api/user'
import { roleList, roleUpdate, getRole, roleCreate } from '@/api/role'
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
        ]
      },
      temp: {
        id: '',
        name: '',
        description: '',
        purview: '',
        permission_menus: '',
        options: []
      },
      loading: false,
      roleOptions: [],
      statusOptions: [],
      menuList: [],
      options_selected: [],
      optionn: [],
      allSelected: false
    }
  },

  created() {
    this.getMenuData()
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      getRole(id)
        .then((response) => {
          this.temp = response.data
          this.temp.id = response.data.id
          this.temp.name = response.data.name
          this.temp.description = response.data.description
          const permission_menus = response.data.permission_menus
          let options = permission_menus.substring(
            1,
            permission_menus.length - 1
          )
          options = options.split(',').map((i) => Number(i))
          this.options_selected = options
        })
        .catch((err) => {
          console.log(err)
        })
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
      const id = this.$route.params && this.$route.params.id
      if (id) {
        this.updateData()
      } else {
        this.createData()
      }
    },
    createData() {
      const option = JSON.stringify(this.options_selected)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            name: this.temp.name,
            description: this.temp.description,
            purview: '[1,2,3]',
            permission_menus: option
          }

          roleCreate(data)
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
      const opt = JSON.stringify(this.options_selected)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            name: this.temp.name,
            description: this.temp.description,
            purview: '[1,2,3]',
            permission_menus: opt
          }
          roleUpdate(this.temp.id, data)
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
        this.$router.push('/manager/role')
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
    getMenuData() {
      getMenuSidebar({ left_menu: 1 }).then((response) => {
        const lists = []
        let indexRow = 0
        response.data.forEach((modules) => {
          let index = 0
          modules.children_menu.forEach((pages) => {
            const optionsList = []
            let indexOption = 0
            pages.children_menu.forEach((options) => {
              optionsList[indexOption] = {
                id: options.id,
                title: options.title
              }
              indexOption++
            })
            let modules_val = ''
            let modules_id = ''
            if (index === 0) {
              modules_val = modules.concat_title
              modules_id = modules.id
            }

            lists[indexRow] = {
              modules: modules_val,
              modulesId: modules_id,
              pages: pages.title,
              pagesId: pages.id,
              optionn: optionsList
            }
            index++
            indexRow++
          })
        })
        this.menuList = lists
      })
    },
    handleBack() {
      this.$router.push('/manager/role')
    },
    selectAll: function() {
      const list = this.menuList
      this.options_selected = []
      if (!this.allSelected) {
        const text = []
        for (let i = 0; i < list.length; i++) {
          this.options_selected.push(list[i].modulesId, list[i].pagesId)
          text.push(list[i].optionn)
        }
        for (let j = 0; j < text.length; j++) {
          for (let k = 0; k < text[j].length; k++) {
            this.options_selected.push(text[j][k].id)
          }
        }
      }
    },
    select: function() {
      this.allSelected = false
    }
  }
}
</script>

<style>
.rtl {
  width: 70% !important;
}
</style>
