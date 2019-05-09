<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      This page was made by the-parker,<br>
      check our
      <a href="https://github.com/Salesio-CS/2018-04-the-parker" target="_blank">our github page</a>.
    </p>
  </div>
</template>

<script>
export default {
  name: 'homeSc',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
