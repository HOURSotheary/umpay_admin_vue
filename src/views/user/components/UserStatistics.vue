<template>
  <div class="drawer-container">
    <el-table :data="tableData" size="small" style="width: 100%">
      <el-table-column prop="label" label="Item" align="right" width="150px" />
      <el-table-column prop="value" label="Data" />
    </el-table>

    <div slot="footer" class="drawer-footer">
      <el-button
        size="small"
        @click="this.$parent.closeDrawer"
      >Close</el-button>
    </div>
  </div>
</template>
<script>
import { userStatistics } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      userStatistics(this.user.id).then((response) => {
        this.tableData = response.data.lists
      })
    }
  }
}
</script>

