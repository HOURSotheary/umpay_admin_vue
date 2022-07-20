<template>
  <div class="drawer-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"> <strong> {{ $t('fiat_trade_order.number') }}</strong></span>
          <span class="value">{{ tableData.number }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.type') }}</strong></span>
          <span class="value">{{ tableData.type_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.crypto_currency') }}</strong></span>
          <span class="value">{{ tableData.crypto_currency_code }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.fiat_currency') }}</strong></span>
          <span class="value">{{ tableData.fiat_currency_code }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.price') }}</strong></span>
          <span class="value">{{ tableData.price }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.title') }}</strong></span>
          <span class="value">{{ tableData.ads_number }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.status') }}</strong></span>
          <span class="value">{{ tableData.status_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.crypto_amount') }}</strong></span>
          <span class="value">{{ tableData.crypto_amount_text }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.fiat_amount') }}</strong></span>
          <span class="value">{{ tableData.fiat_amount_text }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <h4>Payment Information</h4>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.payment_name') }}</strong></span>
          <span class="value">{{ tableData.payment_name }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.account_name') }}</strong></span>
          <span class="value">{{ tableData.user_payment_account_name }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.account_number') }}</strong></span>
          <span class="value">{{ tableData.payment_account }}</span>
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
          <span class="label"><strong> {{ $t('fiat_trade_order.marchannt_account_name') }}</strong></span>
          <span class="value">{{ tableData.merchant_payment_account_name }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.merchant_name') }}</strong></span>
          <span class="value">{{ tableData.merchant_name }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <h4>Time Information</h4>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.complete_at') }}</strong></span>
          <span class="value">{{ tableData.completed_at }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.cancel_at') }}</strong></span>
          <span class="value">{{ tableData.canceled_at }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.created_at') }}</strong></span>
          <span class="value">{{ tableData.created_at }}</span>
        </div>
        <div class="label-value-content">
          <span class="label"><strong> {{ $t('fiat_trade_order.paid_at') }}</strong></span>
          <span class="value">{{ tableData.paid_at }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { tradeFaitOrderDetail } from '@/api/trade-fiat'
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
      tradeFaitOrderDetail(this.data.id).then((response) => {
        this.tableData = response.data
        console.log(this.tableData)
      })
    }
  }
}
</script>

