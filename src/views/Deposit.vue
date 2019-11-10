<template>
  <div class="deposit">
    <template v-if="!done">
    <h2 class="red" v-if="error">{{error}}</h2>
    <template v-else>
      <h1 >Deposit on Ethereum</h1>
      <h3>to send {{deposit}} Sheetcoin to {{email}}</h3>
    </template>
    <div v-if="connected && !error">
      <form @submit.prevent="makeDeposit">
        <!-- <input type="email" v-model="email" placeholder="gmail account"><br> -->
        Amount: <input type="number" v-model="deposit" :max="ethBalance" /><br>
        <button>Deposit</button>
      </form> 
      <div class="flex">
        <div>
          <h3>(Ethereum Balance is 
            <template v-if="!connected">N/A</template>
            <template v-else-if="!ethBalanceLoading">{{ethBalance}}</template>
            <template v-else>loading...</template>)
          </h3>
        </div>
        <!-- <div>
          <h2>Balance on Google Sheets</h2>
          <div v-if="!connected">N/A</div>
          <div v-else-if="!sheetBalanceLoading">{{googleBalance}}</div>
          <div v-else>loading...</div>
        </div> -->
      </div>
    </div>
    <div id="nav" v-else-if="!error">
      <a href="#" class="router-link-active" @click.prevent="connect">{{connected ? 'Web3 Connected' : 'Connect Web3'}}</a>
    </div>
    </template>
    <template v-else>
      done
    </template>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'deposit',
  data() {
    return {
      deposit: 0,
      email: null,
      error: null,
      done: false
    }
  },
  computed: {
    ...mapState(['connected', 'ethBalance', 'googleBalance', 'ethBalanceLoading', 'sheetBalanceLoading'])
  },
  created () {
    var params = JSON.parse(JSON.stringify(this.$route.query))
    if (!params.toAddress || !params.amount) {
        this.error = `Invalid query params amount (${params.amount}) or toAddress (${params.toAddress})`
        return
    }
    this.email = params.toAddress
    this.deposit = params.amount
  },
  methods: {
    ...mapActions(['depositAction']),
    connect() {
      if (this.connected) return
      global.web3Connect.toggleModal(); // open modal on button click
    },
    async makeDeposit () {
      console.log(this.deposit, this.ethBalance)
      if (this.deposit > this.ethBalance) {
        alert(`You only have ${this.ethBalance}, can't move ${this.deposit}`)
        return
      }
      var deposit = this.deposit
      var email = this.email
      await this.depositAction({deposit, email})
      this.done = true
    }
  }
}
</script>
<style>
form {
  line-height: 2em;
}

</style>