<template>
  <div class="drawer-container">

    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      size="mini"
    >
      <el-table-column label="Payment">
        <template slot-scope="scope">
          {{ scope.row.payment_name }}
        </template>
      </el-table-column>
      <el-table-column label="Account Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Account Number">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <div slot="footer" class="drawer-footer">
      <el-button
        size="small"
        @click="this.$parent.closeDrawer"
      >Close</el-button>
    </div>
  </div>
</template>
<script>
import { userPaymentAccount } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      listLoading: false,
      total: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param = {}) {
      const data = param
      data.paginate = param.limit
      this.listLoading = true
      data.user_id = this.user.id
      userPaymentAccount(data).then((response) => {
        this.tableData = response.data.lists
        this.total = response.data.total
        this.listQuery.limit = parseInt(response.data.per_page)
        this.listQuery.page = response.data.current_page
        this.listLoading = false
      })
    }
  }
}
</script>

