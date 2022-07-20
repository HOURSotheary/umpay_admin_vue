<template>
  <div class="drawer-container">
    <el-row :gutter="20" style="font-size: 14px;">
      <el-col :span="24">
        <div class="label-value-content">
          <span class="label"> <strong> {{ $t('gateway_orders.number') }} </strong></span>
          <span class="value">{{ tableData.number }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.merchant') }} </strong></span>
          <span class="value">{{ tableData.merchant_uuid }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.user') }} </strong></span>
          <span class="value">{{ tableData.user_uuid }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.currency') }} </strong></span>
          <span class="value">{{ tableData.currency_code }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.amount') }} </strong></span>
          <span class="value">{{ tableData.amount_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.status') }} </strong></span>
          <span class="value">{{ tableData.status_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.create_date') }} </strong></span>
          <span class="value">{{ tableData.created_at }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('gateway_orders.paid_at') }}</strong></span>
          <span class="value">{{ tableData.paid_at }}</span>
        </div>
      </el-col>
    </el-row>

    <div slot="footer" class="drawer-footer">
      <el-button
        size="small"
        @click="this.$parent.closeDrawer"
      >Close</el-button>
    </div>
  </div>
</template>
<script>
import { gateWayOrderDetail } from '@/api/gateway_order'
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
      gateWayOrderDetail(this.data.id).then((response) => {
        this.tableData = response.data
      })
    }
  }
}
</script>
