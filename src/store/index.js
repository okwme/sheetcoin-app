import Vue from 'vue'
import Vuex from 'vuex'
// import {getTransactionReceiptMined} from '../assets/utils'
Vue.use(Vuex)

import * as contracts from 'sheetcoin'
console.log({contracts})

export default new Vuex.Store({
  state: {
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
      state.ethBalance = ethBalance
    },
    updateEthBalanceLoading (state, ethBalanceLoading) {
      state.ethBalanceLoading = ethBalanceLoading
    },
    updateAllowed (state, allowed) {
      state.allowed = allowed
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
      state.sheetcoinControllerInstance = instance
    }
  },
  actions: {

    async depositAction({state, dispatch}, depositAmount) {
      var tx
      if (depositAmount > state.allowed) {
        const difference = depositAmount - state.Allowed
        console.log({difference})
        tx = await state.sheetcoinInstance.methods.increaseAllowance(state.sheetcoinController.address, difference)
        console.log({tx})
        // await getTransactionReceiptMined(tx)
      }
      console.log({tx})
      await dispatch('getAllowed')
    },
    async getAllowed ({state, commit}) {
      const allowed = await state.sheetcoinInstance.methods.allowance(state.account, contracts['SheetcoinController'].networks[state.networkId].address).call()
      console.log({allowed})
      commit('updateAllowed', parseInt(allowed))
    },
    async getEthBalance({commit, dispatch}) {
      const networkId = await global.web3.eth.net.getId()
      console.log({networkId})
      commit('updateNetworkId', networkId)

      const sheetcoinInstance = await new global.web3.eth.Contract(
        contracts['Sheetcoin'].abi,
        contracts['Sheetcoin'].networks[networkId].address
      )
      commit('updateSheetcoinInstance', sheetcoinInstance)


      const sheetcoinControllerInstance = await new global.web3.eth.Contract(
        contracts['SheetcoinController'].abi,
        contracts['SheetcoinController'].networks[networkId].address
      )
      commit('updateSheetcoinControllerInstance', sheetcoinControllerInstance)

      const [account] = await global.web3.eth.getAccounts()
      console.log({account})
      commit('updateAccount', account)

      const balance = await sheetcoinInstance.methods.balanceOf(account).call()
      console.log({balance})
      commit('updateEthBalance', parseInt(balance))
      commit('updateEthBalanceLoading', false)
      await dispatch('getAllowed')
    }
  },
  modules: {
  }
})
