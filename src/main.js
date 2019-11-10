import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Web3Connect from "web3connect"
import WalletConnectProvider from "@walletconnect/web3-provider"
import Web3 from 'web3'
// import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
// import Squarelink from "squarelink";
import Torus from "@toruslabs/torus-embed";
// import Arkane from "@arkane-network/web3-arkane-provider";
// import Authereum from "authereum";
const FORTMATIC = 'pk_test_903ADB93FD8F027E'
const INFURA = '526b528ee356459a9bdd3a732d8edf71'
global.web3Connect = new Web3Connect.Core({
  network: "rinkeby", // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA // required
      }
    },
    // portis: {
    //   package: Portis, // required
    //   options: {
    //     id: process.env.PORTIS // required
    //   }
    // },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: FORTMATIC // required
      }
    },
    // squarelink: {
    //   package: Squarelink, // required
    //   options: {
    //     id: process.env.SQUARELINK // required
    //   }
    // },
    torus: {
      package: Torus, // required
      options: {
        // network: {
        //   host: 'rinkeby', // default: mainnet
        //   chainId: 4, // default: 1
        //   networkName: 'Rinkeby Test Network' // default: Main Ethereum Network
        // },
        enableLogging: false, // optional
        buttonPosition: "bottom-left", // optional
        // buildEnv: "development", // optional
        showTorusButton: true, // optional
        enabledVerifiers: { // optional
          google: false // optional
        }
      }
    },
    // arkane: {
    //   package: Arkane, // required
    //   options: {
    //     clientId: process.env.ARKANE // required, replace
    //   }
    // },
    // authereum: {
    //   package: Authereum, // required
    //   options: {}
    // }
  }
});

// subscribe to connect
global.web3Connect.on("connect", async (provider) => {
  console.log('connect')
  global.web3 = new Web3(provider); // add provider to web3
  if (global.ethereum) {
    console.log('yes global ethereum')
    try {
      await global.ethereum.enable()
    } catch (error) {
      console.error(error)
    }
  }
  store.commit('connected', true)
  setTimeout(() => {
    store.dispatch('initialize')
  }, 1000)
});

// subscribe to close
global.web3Connect.on("close", () => {
  console.log("Web3Connect Modal Closed"); // modal has closed
});


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
