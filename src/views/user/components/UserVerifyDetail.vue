<template>
  <div class="drawer-container">
    <el-table v-if="tableVisable" :key="tableKey" :data="tableData" size="small" style="width: 100%">
      <el-table-column prop="label" label="Item" align="right" width="200px" />
      <el-table-column prop="value" label="Data" />
    </el-table>

    <div slot="footer" class="drawer-footer">
      <el-button
        size="small"
        @click="handleClose"
      >Close</el-button>
    </div>
  </div>
</template>
<script>
import { userVerifyDetail } from '@/api/user'
export default {
  props: {
    verify: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableKey: '0',
      tableVisable: false,
      tableData: [],
      loading: false
    }
  },
  created() {
    this.tableKey = 'detail-' + this.verify.id
    this.tableVisable = true
    this.fetchData()
  },
  methods: {
    fetchData() {
      userVerifyDetail(this.verify.id).then((response) => {
        this.tableVisable = true
        this.tableData = response.data.lists
      })
    },
    handleClose() {
      this.tableVisable = false
      this.$parent.closeDrawer()
    }
  }
}
</script>

