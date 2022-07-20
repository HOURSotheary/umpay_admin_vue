<template>
  <div class="drawer-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="top"
      size="small"
    >
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        :stripe="true"
        size="mini"
      >
        <el-table-column label="Datetime">
          <template slot-scope="scope">
            {{ scope.row.updated_at }}
          </template>
        </el-table-column>
        <el-table-column label="IP">
          <template slot-scope="scope">
            <span>{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Actions"
          align="center"
          width="130"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="New IP" prop="ip">
        <el-input v-model="temp.ip" placeholder="Enter" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="drawer-footer">
      <el-button
        :loading="loading"
        type="primary"
        size="small"
        @click="handleCreate"
      >
        Confirm
      </el-button>

      <el-button
        size="small"
        @click="this.$parent.closeDrawer"
      >Cancel</el-button>
    </div>
  </div>
</template>
<script>
import {
  merchantIPWhiteListStore,
  getIpWhiteList,
  deleteWhiteList
} from '@/api/merchant'

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
      list: [],
      listLoading: false,
      rules: {
        ip: [{ required: true, trigger: 'blur' }]
      },
      temp: {
        merchant_id: this.data.id,
        ip: ''
      },
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getIpWhiteList(this.data.id).then((response) => {
        this.list = response.data.lists
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          merchantIPWhiteListStore(this.temp)
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
    handleDelete(row) {
      deleteWhiteList(row.id)
        .then((response) => {
          if (response.status === 200) {
            this.$message('Delete Successfully!')
            this.fetchData({})
          }
        })
        .catch((response) => {})
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
