<template>
  <div class="deposit">
    <h1>Move sheetcoin on and off Ethereum</h1>
    <div v-if="connected">
      <form @submit.prevent="makeDeposit">
        <input type="email" v-model="email" placeholder="gmail account">
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
      deposit: 0,
      email: null
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
      var deposit = this.deposit
      var email = this.email
      this.depositAction({deposit, email})
    }
  }
}
</script>