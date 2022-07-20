<template>
  <div class="drawer-container">
    <el-row :gutter="20">
      <h3>Order Information</h3>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"> <strong> Number </strong></span>
          <span class="value">{{ tableData.number }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> UUID </strong></span>
          <span class="value">{{ tableData.uuid }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Currency </strong></span>
          <span class="value">{{ tableData.currency_code }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Status </strong></span>
          <span class="value">{{ tableData.status_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Created At </strong></span>
          <span class="value">{{ tableData.created_at }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Completed At </strong></span>
          <span class="value">{{ tableData.completed_at }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> Type </strong></span>
          <span class="value">{{ tableData.type_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> User Name </strong></span>
          <span class="value">{{ tableData.user_info.name }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Amount </strong></span>
          <span class="value">{{ tableData.amount }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Paid At </strong></span>
          <span class="value">{{ tableData.paid_at }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Cancel At </strong></span>
          <span class="value">{{ tableData.canceled_at }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <h4>Payment Information</h4>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> Payment Name </strong></span>
          <span class="value">{{ tableData.payment_name }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> Account Number </strong></span>
          <span class="value">{{ tableData.payment_account }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> Account Name </strong></span>
          <span class="value">{{ tableData.payment_name }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <h4>Merchant Information</h4>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> UUID </strong></span>
          <span class="value">{{ tableData.merchant_uuid }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> User Name </strong></span>
          <span class="value">{{ tableData.merchant_user_name }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> Merchant Name </strong></span>
          <span class="value">{{ tableData.merchant_name }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { tradeStockOrderDetail } from '@/api/trade-stock'
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
      tradeStockOrderDetail(this.data.id).then((response) => {
        this.tableData = response.data
        console.log(this.tableData)
      })
    }
  }
}
</script>

