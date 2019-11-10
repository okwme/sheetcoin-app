<template>
  <div class="send">
    <h2>Please finalize this send by signing into Google</h2>
    <div class="align-center" id="google-signin"></div>
  </div>
</template>
<script>
import { tokenForRecovery, parseToken } from '../assets/utils';
import {mapState, mapActions} from 'vuex'
export default {
  name: 'send',
  data() {
    return {

    }
  },
  created () {
    console.log(this.$route.query)
    console.log({gapi})
    // const amount = this.amount.toString(16).padStart(64, '0')
    var nonce = btoa(JSON.stringify(this.$route.query)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    console.log({nonce})
    console.log(process.env)
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
        console.log({googleUser})
      const token = googleUser.getAuthResponse().id_token;
      console.log("Signed in", token, parseToken(token))
      this.recover(token);
    },
    recover: async function (token) {
        const { header, payload, signature } = tokenForRecovery(token);
        console.log('Token:', parseToken(token));
        console.log('Recovering identity:', {header}, {payload}, {signature});
        fetch("https://enlvwnocovtw.x.pipedream.net", {
            method: "POST",
            body: JSON.stringify({
                header,  payload, signature
            })
        }).then(async response => await response.json())
        .then(json => {
            console.log({json})
        })
    //   await Identity(this.identityAddress).methods
    //     .recover(header.toString(), payload.toString(), signature)
    //     .send({ from: this.address, gas: 6e6 });
    //   this.updateOwners();
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