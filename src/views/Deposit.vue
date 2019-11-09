<template>
  <div class="deposit">
    <h1>Move sheetcoin on and off Ethereum</h1>

    <div>
      <h2>Balance on Ethereum</h2>
      <div v-if="!connected">Please Connect</div>
      <div v-else-if="!ethBalanceLoading">{{ethBalance}}</div>
      <div v-else>loading...</div>
    </div>
    <div>
      <h2>Balance on Google Sheets</h2>
      <div v-if="!connected">Please Connect</div>
      <div v-else-if="!sheetBalanceLoading">{{googleBalance}}</div>
      <div v-else>loading...</div>
    </div>
    <hr>
    <div v-if="connected">
      <form @submit.prevent="makeDeposit">
        <input type="number" v-model="deposit" :max="ethBalance" />
        <button>Move to Google Sheets</button>
      </form>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'deposit',
  data() {
    return {
      deposit: 0
    }
  },
  computed: {
    ...mapState(['connected', 'ethBalance', 'googleBalance', 'ethBalanceLoading', 'sheetBalanceLoading'])
  },
  methods: {
    ...mapActions(['depositAction']),
    makeDeposit () {
      console.log(this.deposit, this.ethBalance)
      if (this.deposit > this.ethBalance) {
        alert(`You only have ${this.ethBalance}, can't move ${this.deposit}`)
        return
      }
      this.depositAction(this.deposit)
    }
  }
}
</script>