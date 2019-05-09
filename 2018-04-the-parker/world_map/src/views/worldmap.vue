<template>
  <div>
    <p>{{message}}</p>

    <p>{{currency}}</p>
    <div v-for="item in items">
      <button v-on:click="changeMsg(item)">{{item.country}}</button>
    </div>

  </div>
</template>

<script>
  export default{
    data:function(){
    return{
        message: 'choose the country',
        currency:'Display the currency of the country',
        items:[
          {country: 'America' , currency: 'usd'},
          {country: 'Europe' , currency: 'eur'},
          {country: 'England' , currency: 'gdp'},
          {country: 'Canada' , currency: 'cad'},
          {country: 'Switzerland' , currency: 'chf'},
          {country: 'Australia' , currency: 'aud'},
          {country: 'New Zealand' , currency: 'nzd'},
          {country: 'Singapore' , currency: 'sgd'},
          {country: 'Norway' , currency: 'nok'},
          {country: 'Russia' , currency: 'rub'},
          {country: 'Sweden' , currency: 'sek'},
          {country: 'Turkey' , currency: 'try'},
          {country: 'South Africa' , currency: 'zar'},
          {country: 'Hong Kong' , currency: 'hkd'},
          {country: 'China' , currency: 'cnh'},
          {country: 'Denmark' , currency: 'dkk'},
          {country: 'Mexico' , currency: 'mxn'},
          {country: 'Poland' , currency: 'pln'}
        ]
        }
    },
    methods:{
      changeMsg:function(item){
        this.message = item.country
        this.currency = item.currency
      }
    }
  }
</script>
