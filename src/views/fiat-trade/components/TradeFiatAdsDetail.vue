<template>
  <div class="drawer-container">
    <el-row>
      <el-col
        v-for="(value, index) in tableData"
        :key="index"
        :span="12"
      >
        <div class="label-value-content">
          <span class="label">{{ value.label }}</span>
          <span class="value">{{ value.value }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { tradeFaitAdsDetail } from '@/api/trade-fiat'
export default {
  props: {
    data: {
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
      tradeFaitAdsDetail(this.data.id).then((response) => {
        this.tableData = response.data.lists
      })
    }
  }
}
</script>

