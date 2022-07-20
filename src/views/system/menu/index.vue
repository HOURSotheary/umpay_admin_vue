<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="box-card-header clearfix">
        <div class="box-card-header-title">{{ $t('menu_page.title') }}</div>
        <div class="box-card-header-options">
          <el-button
            size="small"
            type="success"
            @click="handleCreate"
          >Create</el-button>
        </div>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
      >
        <el-table-column :label="$t('menu_page.level')">
          <template slot-scope="scope">
            {{ scope.row.level }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('menu_page.titles')">
          <template slot-scope="scope">
            {{ scope.row.concat_title }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('menu_page.sort')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <operate-options
              :options="operateOptions"
              :row="row"
              @action="handleAction"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      width="800px"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :key="formKey"
        :rules="rules"
        :model="temp"
        label-width="100px"
        size="small"
      >
        <el-form-item label="Level" prop="level">
          <el-select
            v-model="temp.level"
            placeholder="Select"
            size="small"
            class="form-item-select"
            @change="onChangeLevel"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="(value, index) in menuLevelOptions"
              :key="index"
              :label="value"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Parent Menu" prop="parent_id">
          <el-select
            v-model="temp.parent_id"
            placeholder="Select"
            class="form-item-select"
          >
            <el-option key="" label="All" value="" />

            <el-option
              v-for="value in parentMenuOptions"
              :key="value.id"
              :label="value.title"
              :value="value.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Router" prop="route">
          <el-input v-model="temp.route" />
        </el-form-item>
        <el-form-item label="Component" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="Icon" prop="icon">
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item label="Sort" prop="order">
          <el-input v-model="temp.order" />
        </el-form-item>
        <el-form-item label="I18n Key" prop="i18n_key">
          <el-input v-model="temp.i18n_key" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="dialogFormVisible = false"
        >Cancel</el-button>
        <el-button
          :loading="loading"
          type="primary"
          size="small"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  menuList,
  menuCreate,
  menuLevelList,
  getMenu,
  menuUpdate,
  parentMenuList,
  deleteMenu
} from '@/api/menu'
import OperateOptions from '@/components/OperateOptions'

const defaultValueForm = {
  id: 0,
  level: '',
  parent_id: 0,
  title: '',
  name: '',
  route: '',
  icon: '',
  order: '',
  i18n_key: '',
  component: ''
}

export default {
  components: {
    OperateOptions
  },
  data() {
    return {
      list: [],
      listLoading: false,
      loading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        level: [{ required: true, trigger: 'blur' }],
        parent_id: [{ required: false, trigger: 'blur' }],
        title: [{ required: true, trigger: 'blur' }],
        name: [{ required: true, trigger: 'blur' }],
        route: [{ required: true, trigger: 'blur' }],
        icon: [{ required: true, trigger: 'change' }],
        order: [{ required: true, trigger: 'change' }],
        i18n_key: [{ required: true, trigger: 'change' }],
        component: [{ required: true, trigger: 'change' }]
      },
      menuLevelOptions: [],
      parentMenuOptions: [],
      operateOptions: [],
      formKey: '0',
      temp: defaultValueForm
    }
  },
  created() {
    this.operateOptions = this.$route.meta.operate_options
    this.fetchData({})
    this.fetchMenuLevel({})
  },
  methods: {
    fetchData(param) {
      const data = param
      this.listLoading = true
      menuList(data).then((response) => {
        this.list = Object.keys(response.data).length === 0 ? [] : response.data
        this.listLoading = false
      })
    },
    fetchMenuLevel() {
      menuLevelList().then((response) => {
        this.menuLevelOptions = response.data
      })
    },
    handleOpenPopup(target) {
      this.parentMenuOptions = []
      this.dialogStatus = target
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleAfterRequest(response) {
      const target = this.dialogStatus === 'create' ? 'Registered' : 'Updated'

      if (response.status === 200) {
        this.$message(target + ' Successfully!')
        this.dialogFormVisible = false
        this.fetchData({})
      } else {
        let messageError = ''
        Object.keys(response.data).forEach(function(key) {
          messageError += '\n' + response.data[key][0]
        })
        this.$message({
          message: target + ' Failed!' + '\n' + messageError,
          type: 'warning'
        })
      }
    },
    resetTemp() {
      this.temp = defaultValueForm
    },
    handleCreate() {
      this.handleOpenPopup('create')
      this.resetTemp()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          menuCreate(this.temp)
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
    handleAction(event, row) {
      if (event === 'edit') {
        this.handleUpdate(row)
      } else if (event === 'delete') {
        this.handleDelete(row)
      }
    },
    handleDelete(row) {
      deleteMenu(row.id)
        .then((response) => {
          if (response.status === 200) {
            this.$message('Delete Successfully!')
            this.fetchData({})
          }
        })
        .catch((response) => {})
    },
    handleUpdate(row) {
      this.formKey = row.id
      getMenu(row.id).then((response) => {
        const item = response.data
        this.temp = {
          id: item.id,
          level: item.level.toString(),
          parent_id: undefined,
          title: item.title,
          name: item.name,
          route: item.route,
          icon: item.icon,
          order: item.order,
          i18n_key: item.i18n_key,
          component: item.component
        }
        if (item.parent_id) {
          this.onChangeLevel(item.level, item.parent_id)
        }
        this.handleOpenPopup('update')
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          menuUpdate(this.temp.id, this.temp)
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
    onChangeLevel(value, parent_id = null) {
      const params = {
        level: value
      }
      parentMenuList(params)
        .then((response) => {
          this.parentMenuOptions = response.data
          if (parent_id) {
            this.temp.parent_id = parent_id
          }
        })
        .catch((response) => {})
    }
  }
}
</script>
