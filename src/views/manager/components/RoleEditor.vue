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

      <el-table
        v-loading="listLoading"
        :data="menuList"
        element-loading-text="Loading"
        border
        fit
        :stripe="true"
        size="mini"
      >
        <el-table-column label="Module">
          <template slot-scope="scope">
            <el-checkbox
              v-show="scope.row.modules"
              :key="scope.row.modules"
              :label="scope.row.modules"
            >
              {{ scope.row.modules }}
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Page">
          <template slot-scope="scope">
            <el-checkbox :key="scope.row.pages" :label="scope.row.pages">
              {{ scope.row.pages }}
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Options">
          <template slot-scope="scope">
            <el-checkbox-group v-model="temp.options">
              <el-checkbox
                v-for="item in scope.row.options"
                :key="item.id"
                :label="item.id"
              >
                {{ item.title }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
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
import { managerStatusList, managerCreate, managerUpdate } from '@/api/manager'
import { getMenuSidebar } from '@/api/user'
import { roleList, roleUpdate } from '@/api/role'
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
        ]
        // password: [{ required: true, trigger: 'blur' }],
        // pin: [{ required: true, trigger: 'blur' }]
      },
      temp: {
        id: '',
        name: '',
        description: '',
        options: []
      },
      loading: false,
      roleOptions: [],
      statusOptions: [],
      menuList: []
    }
  },
  created() {
    this.getMenuData()
    if (this.event === 'edit') {
      this.temp.id = this.data.id
      this.temp.name = this.data.name
      this.temp.description = this.data.description
      const permission_menus = this.data.permission_menus
      let options = permission_menus.substring(1, permission_menus.length - 1)
      options = options.split(',').map((i) => Number(i))
      this.temp.options = options
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
          console.log(this.temp)
          const data = {
            name: this.temp.name,
            description: this.temp.description,
            purview: '[1,2,3]',
            permission_menus: '[' + this.temp.options.toString() + ']'
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
    getMenuData() {
      getMenuSidebar({ left_menu: 1 }).then((response) => {
        // console.log(response.data);
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
            if (index === 0) {
              modules_val = modules.concat_title
            }

            lists[indexRow] = {
              modules: modules_val,
              pages: pages.title,
              options: optionsList
            }

            index++
            indexRow++
          })
        })

        this.menuList = lists
      })
    }
  }
}
</script>

<style>
.rtl {
  width: 70% !important;
}
</style>
