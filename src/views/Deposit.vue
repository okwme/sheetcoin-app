<template>
  <div class="deposit">
    <h1>Deposit Eth Sheetcoin to Google Sheets</h1>
    <div v-if="connected">
      <form @submit.prevent="makeDeposit">
        <input type="email" v-model="email" placeholder="gmail account"><br>
        <input type="number" v-model="deposit" :max="ethBalance" /><br>
        <button>Move to Google Sheets</button>
      </form>
      <div class="flex">
      <div>
        <h2>Balance on Ethereum</h2>
        <div v-if="!connected">N/A</div>
        <div v-else-if="!ethBalanceLoading">{{ethBalance}}</div>
        <div v-else>loading...</div>
      </div>
      <div>
        <h2>Balance on Google Sheets</h2>
        <div v-if="!connected">N/A</div>
        <div v-else-if="!sheetBalanceLoading">{{googleBalance}}</div>
        <div v-else>loading...</div>
      </div>
    </div>
    </div>
    <div id="nav" v-else>
      <a href="#" class="router-link-active" @click.prevent="connect">{{connected ? 'Connected' : 'Connect'}}</a>
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
    connect() {
      if (this.connected) return
      global.web3Connect.toggleModal(); // open modal on button click
    },
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