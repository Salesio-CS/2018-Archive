
<template>
  <div id="app">
    <button @click="getPosts()">start</button>
    <button @click="passData(0)">EURJPY</button>
    <button @click="passData(1)">USDJPY</button>
    <button @click="passData(2)">GBPJPY</button>
    <button @click="passData(3)">CADJPY</button>
    <button @click="passData(4)">CHFJPY</button>
    <button @click="passData(5)">AUDJPY</button>
    <button @click="passData(6)">NZDJPY</button>
    <button @click="passData(7)">SGDJPY</button>
    <button @click="passData(8)">NOKJPY</button>
    <button @click="passData(9)">RUBJPY</button>
    <button @click="passData(10)">SEKJPY</button>
    <button @click="passData(11)">TRYJPY</button>
    <button @click="passData(12)">ZARJPY</button>
    <button @click="passData(13)">HKDJPY</button>
    <button @click="passData(14)">CNHJPY</button>
    <button @click="passData(15)">DKKJPY</button>
    <button @click="passData(16)">MXNJPY</button>
    <button @click="passData(17)">PLNJPY</button>
    <ul>
      <li v-for:"price in prices">{{prices}}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: 'app',
  data: function() {
    return {
      posts: [],
      data: []
    }
  },
  computed: {
  },
  methods: {
    getPrice: function() {
      for (var i in this.posts) {
        this.data[i] = [this.posts[i].symbol, this.posts[i].price];
        i += 1;
      }
    },
    getPosts: function() {
      axios.get('http://forex.1forge.com/1.0.3/quotes?pairs=EURJPY,USDJPY,GBPJPY,CADJPY,CHFJPY,AUDJPY,NZDJPY,SGDJPY,NOKJPY,RUBJPY,SEKJPY,TRYJPY,ZARJPY,HKDJPY,CNHJPY,DKKJPY,MXNJPY,PLNJPY&api_key=pVXJKpRVB7tuW2vyFYB1zmcLo3kRvq2u')
      .then(response => {
        this.posts = response.data;
      })
      .catch(error => {
        window.alert(error);
      });
      this.getPrice();
      console.log('ready');
    },
    passData: function(i) {
      console.log(this.data[i]);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
