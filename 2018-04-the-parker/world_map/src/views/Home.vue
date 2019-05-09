<template>
  <div class="home">
    <img src="../assets/s_15460.png">
    <HelloWorld msg="Welcome to the-parker's app"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/homeSc.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
