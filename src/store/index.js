import Vue from 'vue'
import Vuex from 'vuex'
import {getTransactionReceiptMined}from '../assets/utils'
Vue.use(Vuex)

import * as contracts from 'sheetcoin'
console.log({contracts})
var sheetcoinInstance, sheetcoinControllerInstance
export default new Vuex.Store({
  state: {
    loading: false,
    loadingMsg: null,
    account: null,
    connected: false,
    networkId: false,
    ethBalanceLoading: true,
    sheetBalanceLoading: true,
    ethBalance: 0,
    googleBalance: 0,
    allowed: 0,
    sheetcoinInstance: null,
    sheetcoinControllerInstance: null
  },
  mutations: {
    connected (state, connected) {
      state.connected = connected
    },
    updateEthBalance (state, ethBalance) {
      state.ethBalance = parseInt(ethBalance)
    },
    updateEthBalanceLoading (state, ethBalanceLoading) {
      state.ethBalanceLoading = ethBalanceLoading
    },
    updateAllowed (state, allowed) {
      state.allowed = parseInt(allowed)
    },
    updateNetworkId (state, networkId) {
      state.networkId = networkId
    },
    updateAccount (state, account) {
      state.account = account
    },
    updateSheetcoinInstance (state, instance) {
      state.sheetcoinInstance = instance
    },
    updateSheetcoinControllerInstance (state, instance) {
      console.log('update sheetcoinControllerInstance')
      state.sheetcoinControllerInstance = instance
    },
    updateLoading (state, loading) {
      state.loading = loading
    },
    updateLoadingMsg (state, loadingMsg) {
      state.loadingMsg = loadingMsg
    }
  },
  actions: {
    async relayAction({commit, state, dispatch}, {toAddress, sequence, amount, signature}) {
      commit('updateLoading', true)
      commit('updateLoadingMsg', 'Relaying your withdrawal to Etherum')
      var tx, receipt
      try {
        tx = await sheetcoinControllerInstance.methods.withdraw(sequence, toAddress, amount.toString(10), signature).send({
          from: state.account
        })
        receipt = await getTransactionReceiptMined(tx.transactionHash, 100)
      } catch (error) {
        commit('updateLoading', false)
        commit('updateLoadingMsg', null)
        console.log({error})
        throw error
      }
      commit('updateLoading', false)
      commit('updateLoadingMsg', null)

      console.log({tx})
      console.log({receipt})
      await dispatch('getAllowed')
      await dispatch('getEthBalance')
    },
    async depositAction({state, dispatch, commit}, {deposit, email}) {
      deposit = parseInt(deposit)
      console.log(deposit, state.allowed)
      var tx, receipt
      if (deposit > state.allowed) {
        const difference = deposit - state.allowed
        console.log({difference})
        console.log(state.account)
        console.log(sheetcoinControllerInstance, sheetcoinControllerInstance._address)

        commit('updateLoading', true)
        commit('updateLoadingMsg', 'Allowing Ethereum to hold your sheet')
        tx = await sheetcoinInstance.methods.increaseAllowance(sheetcoinControllerInstance._address, difference).send({
          from: state.account
        })
        console.log({tx})
        receipt = await getTransactionReceiptMined(tx.transactionHash, 100)
        commit('updateLoading', false)
        commit('updateLoadingMsg', null)
      }
      console.log({deposit, email})


      commit('updateLoading', true)
      commit('updateLoadingMsg', 'Moving your Sheetcoin to Google Sheets')
      tx = await sheetcoinControllerInstance.methods.deposit(deposit.toString(10), email).send({
        from: state.account
      })
      receipt = await getTransactionReceiptMined(tx.transactionHash, 100)
      commit('updateLoading', false)
      commit('updateLoadingMsg', null)

      console.log({tx})
      console.log({receipt})
      await dispatch('getAllowed')
      await dispatch('getEthBalance')
    },
    async getAllowed ({state, commit}) {
      const allowed = await sheetcoinInstance.methods.allowance(state.account, contracts['SheetcoinController'].networks[state.networkId].address).call()
      console.log({allowed})
      commit('updateAllowed', allowed)
    },
    async getEthBalance ({state, commit}) {
      commit('updateEthBalanceLoading', true)
      const balance = await sheetcoinInstance.methods.balanceOf(state.account).call()
      console.log({balance})
      commit('updateEthBalance', balance)
      commit('updateEthBalanceLoading', false)
    },
    async initialize({commit, dispatch}) {
      const networkId = await global.web3.eth.net.getId()
      console.log({networkId})
      commit('updateNetworkId', networkId)
      console.log(contracts['Sheetcoin'].networks)
      sheetcoinInstance = await new global.web3.eth.Contract(
        contracts['Sheetcoin'].abi,
        contracts['Sheetcoin'].networks[networkId].address
      )
      console.log(contracts['SheetcoinController'].networks[networkId])
      console.log(contracts['SheetcoinController'].abi.length)
      sheetcoinControllerInstance = await new global.web3.eth.Contract(
        contracts['SheetcoinController'].abi,
        contracts['SheetcoinController'].networks[networkId].address
      )
      console.log('sheetcoinControllerInstance')

      const [account] = await global.web3.eth.getAccounts()
      console.log({account})
      commit('updateAccount', account)

      await dispatch('getEthBalance')
      await dispatch('getAllowed')
    }
  },
  modules: {
  }
})
