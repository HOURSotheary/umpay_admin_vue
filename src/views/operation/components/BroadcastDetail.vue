<template>
  <div class="drawer-container">
    <el-table v-if="tableVisable" :key="tableKey" :data="tableData" size="small" style="width: 100%">
      <el-table-column prop="label" label="Item" align="right" width="150px" />
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
import { broadcastDetail } from '@/api/broadcast'
export default {
  props: {
    data: {
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
    console.log(this.data)
    this.tableKey = 'detail-' + this.data.id
    this.tableVisable = true
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('DDDDDD' + this.data.id)
      broadcastDetail(this.data.id).then((response) => {
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

