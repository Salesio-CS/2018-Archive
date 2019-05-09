<template>
  <div id="app">
  あと
  秒
</div>
</template>

<script>
export default{
  el: "#app",
  data() {
    return {
      a: 30,
      mySetInterval: undefined
    }
  },
  methods: {
    updateData: function() {
      console.log("oppai")
    }
  },
  mounted: function() {
    this.mySetInterval = setInterval(this.updateData, 1000 )
  },
  beforeDestroy: function() {
    clearInterval(this.mySetInterval)
  }
}
</script>
