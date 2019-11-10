<template>
  <div class="send">
    <h2 class="red" v-if="error">{{error}}</h2>
    <template v-else>
        <h2>{{msg}}</h2>
        <h3 v-if="!done">to send {{$route.query.amount}} Sheetcoin to {{$route.query.toAddress}}</h3>
        <div v-if="!done" class="align-center" id="google-signin"></div>
    </template>
  </div>
</template>
<script>
import { tokenForRecovery, parseToken } from '../assets/utils';
import {mapState, mapActions} from 'vuex'
export default {
  name: 'send',
  data() {
    return {
        done: false,
        msg: 'Please Sign in with Google',
        error: null,
        nonce: null
    }
  },
  created () {
    console.log(this.$route.query)
    var nonce = JSON.parse(JSON.stringify(this.$route.query))
    if (!nonce.amount || !nonce.toAddress) {
        this.error = `Invalid query params amount (${nonce.amount}) or toAddress (${nonce.toAddress})`
        return
    }
    nonce.amount = parseInt(nonce.amount)

    console.log({nonce})
    this.nonce = nonce
    nonce = btoa(JSON.stringify(nonce)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    console.log({nonce})
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            ux_mode: 'popup',
            nonce,
            scope: 'openid email'
        }).then(() => {
            return this.signOut()
        }).then(() => {

            console.log('after signout')

            gapi.signin2.render('google-signin', {
                onsuccess: this.handleLogin,
                onfailure: this.handleFailure,
                longtitle: true,
                scope: 'openid email' // TODO: How to prevent google from returning all profile info?
            });
        });
    });
  },
  computed: {
    ...mapState([])
  },
  methods: {
    ...mapActions([]),
    signOut: async function() {
      return gapi.auth2.getAuthInstance().signOut().then(() => console.log("Signed out"));
    },
    handleFailure: function(err) {
      this.error = err;
    },
    handleLogin: function(googleUser) {
      const token = googleUser.getAuthResponse().id_token;
    //   console.log("Signed in", token, parseToken(token))
      this.recover(token);
    },
    recover: async function (token) {
        console.log({token})
        // const { header, payload, signature } = tokenForRecovery(token);
        // console.log('Token:', parseToken(token));
        // console.log('Recovering identity:', {header}, {payload}, {signature});
        // fetch("https://us-central1-sheetcoin-258516.cloudfunctions.net/send", {
        fetch("https://script.google.com/macros/s/AKfycby2aArgZZ9x7kZhdJdgTuLZ5uqeA4kXQ6ZtNI1DR5_P4t5vJqE/exec", { // TODO: replace with sheets endpoint
            method: "POST",
            body: JSON.stringify({
                token
            })
        })
        .then(async response => await response.json())
        .then(json => {
            console.log({json})
            this.msg = "Thanks, you can return to Google Sheets now"
            this.done = true
            window.open('', '_self', '').close();
        })
    }
  }
}
</script>
<style scoped>

.align-center {
    margin:auto;
    display:inline-block;
}
</style>