
<template>
  <div id="contents">

    <GChart
      :settings="chartSettings"
      type="GeoChart"
      :data="chartData"
      :options="chartOptions"
    />
    <button @click="drawData()">Please press the button twice </button>

    </div>
</template>


<script>
import { GChart } from 'vue-google-charts';
import axios from "axios";
var t = 0;
var pointData = [
  ['City', 'Rate'],
  ['United States', 0],
  ['Europe', 0],
  ['England', 0],
  ['Canada', 0],
  ['Switzerland', 0],
  ['Australia', 0],
  ['New Zealand', 0],
  ['Singapore', 0],
  ['Norway', 0],
  ['Russia', 0],
  ['Sweden', 0],
  ['Turkey', 0],
  ['South Africa', 0],
  ['Hong Kong', 0],
  ['China', 0],
  ['Denmark', 0],
  ['Mexico', 0],
  ['Poland', 0],
  // 以下略
]

export default {
  components: {
    GChart
  },
  data() {
    return {
      posts: [],
      data: [],
      a:[],
      mySetInterval: undefined,
      pointData,
      chartSettings: {
        packages: ['geochart'],
        'mapsApiKey': 'ここにGoogleMapAPI-key'
      },

      chartData:  pointData,
      chartOptions: {
        colorAxis: {colors:['#0000FF','#00FFFF','#00FF00']},
        region: 'world',
        resolution: 'markers',
        displayMode: 'merkers',
      }
    };
  },
  methods:{
    getPrice: function(){
      for (var i in this.posts){
        this.data[i] = [this.posts[i].symbol, this.posts[i].price];
        this.a[i] = this.posts[i].price;
        i += 1;
      }
    },
    passData: function(i) {
      console.log(this.data[i]);
    },
    getPosts: function(){
      axios.get('http://forex.1forge.com/1.0.3/quotes?pairs=EURJPY,USDJPY,GBPJPY,CADJPY,CHFJPY,AUDJPY,NZDJPY,SGDJPY,NOKJPY,RUBJPY,SEKJPY,TRYJPY,ZARJPY,HKDJPY,CNHJPY,DKKJPY,MXNJPY,PLNJPY&api_key=pVXJKpRVB7tuW2vyFYB1zmcLo3kRvq2u')
      .then(response => {
        this.posts = response.data;
      })
      .catch(error => {
        window.alert(error);
      });
      this.getPrice();
      console.log('ready');
      console.log(this.data[1]);
    },

    drawData: function() {
      this.getPosts();
      if(t >= 1){
      var pointData = [
        ['City', 'Rate'],
        ['United States', this.a[1]],
        ['Europe', this.a[0]],
        ['England', this.a[2] ],
        ['Canada', this.a[3]],
        ['Switzerland', this.a[4]],
        ['Australia', this.a[5]],
        ['New Zealand', this.a[6]],
        ['Singapore', this.a[7]],
        ['Norway', this.a[8]],
        ['Russia', this.a[9]],
        ['Sweden', this.a[10]],
        ['Turkey', this.a[11]],
        ['South Africa', this.a[12]],
        ['Hong Kong', this.a[13]],
        ['China', this.a[14]],
        ['Denmark', this.a[15]],
        ['Mexico', this.a[16]],
        ['Poland', this.a[17]],
      ];
       this.chartData = google.visualization.arrayToDataTable(pointData);
       var chart = new google.visualization.GeoChart(document.getElementById('contents'));
       google.visualization.events.addListener(chart, 'select', this.myClickHandler());
       chart.draw(this.chartData,this.chartOptions);
     }
     t = t + 1;
    }

  },
  mounted: function() {
    this.mySetInterval = setInterval(this.drawData, 1000*100)
  },
  beforeDestroy: function() {
    clearInterval(this.mySetInterval)
  }
}
</script>
