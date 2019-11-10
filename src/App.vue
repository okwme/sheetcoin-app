<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/deposit">Deposit</router-link> |
      <a href="#" class="router-link-active" @click.prevent="connect">{{connected ? 'Connected' : 'Connect'}}</a>
    </div> -->
    <!-- <div class="flex">
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
    <hr> -->
    <div id="loading" v-if="loading" >
      {{loadingMsg}}
    </div>
    <router-view/>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      foo: 'bar'
    }
  },
  methods: {
    connect() {
      if (this.connected) return
      global.web3Connect.toggleModal(); // open modal on button click
    }
  },
  computed: {
    ...mapState(['loading', 'loadingMsg', 'connected', 'ethBalance', 'googleBalance', 'ethBalanceLoading', 'sheetBalanceLoading'])
  }
}
  </script>

<style>
#loading {
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background-color: rgba(0,0,0,0.5);
  color: white;
  line-height:100vh;
  font-size: 2em;
}
.flex {
  display: flex;
  justify-content: space-evenly;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.red {
  color: red;
}
</style>
