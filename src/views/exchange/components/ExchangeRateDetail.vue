<template>
  <div class="drawer-container">
    <el-table :data="tableData.lists" size="small" style="width: 100%">
      <el-table-column prop="label" label="Item" align="right" width="200px" />
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
import { exchangeRateDetail } from '@/api/exchange'
export default {
  props: {
    rate: {
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
      exchangeRateDetail(this.rate.id).then((response) => {
        this.tableData = response.data
      })
    }
  }
}
</script>
