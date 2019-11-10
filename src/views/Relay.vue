<template>
  <div class="deposit">
    <template v-if="!done">
        <h2 class="red" v-if="error">{{error}}</h2>
        <template v-else>
        <h1 >Relay withdrawal to Ethereum</h1>
        <h3>to send {{amount}} Sheetcoin to {{toAddress}}</h3>
        </template>
        <div v-if="connected && !error">
        <form @submit.prevent="makeRelay">
            <button>Submit</button>
        </form> 
        <div class="flex">
            <div>
            <h3>(Ethereum Balance is 
                <template v-if="!connected">N/A</template>
                <template v-else-if="!ethBalanceLoading">{{ethBalance}}</template>
                <template v-else>loading...</template>)
            </h3>
            </div>
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
import { isHex } from '../assets/utils';

export default {
  name: 'relay',
  data() {
    return {
      error: null,
      done: false,
      amount: null,
      toAddress: null
    }
  },
  computed: {
    ...mapState(['connected', 'ethBalance', 'googleBalance', 'ethBalanceLoading', 'sheetBalanceLoading'])
  },
  created () {
    var params = JSON.parse(JSON.stringify(this.$route.query))
    if (!params.toAddress || !params.amount || !params.sequence || !params.signature || !isHex(params.toAddress)) {
        this.error = `Invalid query params amount (${params.amount}), toAddress (${params.toAddress}), sequence (${params.sequence}) or signature (${params.signature})`
        return
    }
    this.amount = params.amount
    this.toAddress = params.toAddress
  },
  methods: {
    ...mapActions(['relayAction']),
    connect() {
      if (this.connected) return
      global.web3Connect.toggleModal(); // open modal on button click
    },
    async makeRelay () {
        try {
            var params = JSON.parse(JSON.stringify(this.$route.query))
            await this.relayAction(params)
            this.done = true
            window.open('', '_self', '').close();
        } catch(error) {
            console.log(error)
            this.error = error.message
        }
    }
  }
}
</script>
<style>
form {
  line-height: 2em;
}

</style>