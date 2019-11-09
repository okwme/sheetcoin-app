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

global.web3Connect = new Web3Connect.Core({
  network: "mainnet", // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.INFURA // required
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
        key: process.env.FORTMATIC // required
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
        enableLogging: false, // optional
        buttonPosition: "bottom-left", // optional
        buildEnv: "production", // optional
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
    store.dispatch('getEthBalance')
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
