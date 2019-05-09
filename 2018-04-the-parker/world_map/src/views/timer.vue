<template>
  <div>
    <span>{{ minutes | pad }}分</span>
    <span>{{ seconds | pad }}秒</span>
    <span>{{ cs | pad }}</span>
  </div>
</template>

<script>
  export default{
    name: 'duration-view',
    props: ['value'],
    computed: {
      minutes() {
        return Math.trunc(this.value / 1000 / 60);
      },
      seconds(){
        return Math.trunc(this.value / 1000) % 60;
      },
      cs(){
        return Math.trunc(this.value / 10) % 100;
      },
    },
    filters: {
      pad(value) {
        return value.toString().padStart(2, '0');
      },
    },
  };
</script>
