<style>
.country-button{
  margin-right: 50px;
}
</style>
<template>
  <v-app >
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      :temporary="temporary"
      app
    >

      <!-- ここまで  -->

    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      color="primary"
      class="white--text"
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer class="hidden-xs"></v-spacer>

      <!-- 必要なやつ -->
      <button icon @click.stop="addFeed('Europe')" role="button" title="Add Feed" class="country-button">
       Europe
     </button>
      <button icon @click.stop="addFeed('America')" role="button" title="Add Feed" class="country-button">
       America
     </button>
     <button icon @click.stop="addFeed('England')" role="button" title="Add Feed" class="country-button">
      England
    </button>
    <button icon @click.stop="addFeed('Canada')" role="button" title="Add Feed" class="country-button">
     Canada
   </button>
   <button icon @click.stop="addFeed('Switzerland')" role="button" title="Add Feed" class="country-button">
    Switzerland
  </button>
    <button icon @click.stop="addFeed('newZealand')" role="button" title="Add Feed" class="country-button">
     newZealand
   </button>
   <button icon @click.stop="addFeed('Singapore')" role="button" title="Add Feed" class="country-button">
    Singapore
  </button>
   <button icon @click.stop="addFeed('Norway')" role="button" title="Add Feed" class="country-button">
    Norway
  </button>
   <button icon @click.stop="addFeed('Russia')" role="button" title="Add Feed" class="country-button">
    Russia
  </button>
   <button icon @click.stop="addFeed('Sweden')" role="button" title="Add Feed" class="country-button">
    Sweden
  </button>
   <button icon @click.stop="addFeed('Turkey')" role="button" title="Add Feed" class="country-button">
    Turkey
  </button>
   <button icon @click.stop="addFeed('SouthAfrica')" role="button" title="Add Feed" class="country-button">
    SouthAfrica
  </button>
   <button icon @click.stop="addFeed('HongKong')" role="button" title="Add Feed" class="country-button">
    HonkKong
  </button>
   <button icon @click.stop="addFeed('Chinese')" role="button" title="Add Feed" class="country-button">
    Denmark
  </button>
   <button icon @click.stop="addFeed('Mexico')" role="button" title="Add Feed" class="country-button">
    Mexico
  </button>
   <button icon @click.stop="addFeed('Porland')" role="button" title="Add Feed" class="country-button">
    Porland
  </button>
      <!-- ここまで  -->
    </v-toolbar>
    <v-content>
       <div class="text-xs-center" v-if="feedItems.length == 0 && isLoading">
      <v-progress-circular
      :size="70"
      :width="7"
      color="primary"
      indeterminate
      class="mt-5"
    ></v-progress-circular>
       </div>
      <div v-for="(item, i) in feedItems" :key="i" style="width: 200px; margin: auto">
          <FeedCard v-if="i != 0" :item="item" />
      </div>
    </v-content>
  </v-app>
</template>
<style>
@media screen and (max-width: 768px) {
  body {
    /* font-size: 16px; */
    font-size: 8px;
  }
  .v-footer {
    justify-content: center;
  }
}
</style>

<script>
import FeedCard from "./../components/FeedCard";

function isMobile() {
  return window.innerWidth < 993;
}
export default {
  name: "App",
  components: {
    FeedCard,
  },
  data() {
    let mobile = isMobile();
    window.addEventListener(
      "resize",
      function() {
        mobile = isMobile();
      },
      false
    );

    return {
      clipped: true,
      drawer: !mobile,
      temporary: mobile,
      fixed: false,
      dialog: false,
      feedData: [],
      isLoading: false,
      feedItems: [],
      miniVariant: false,
      title: "VueFeed",
      selectedFeed: {}
    };
  },
  methods: {
    selectItem(feed) {
      this.selectedFeed = feed || {};
      if (feed) {
        this.feedItems = feed.items;
      } else {
        this.feedData.forEach(ifeed => {
          this.feedItems = this.feedItems.concat(ifeed.items);
        });
      }
    },
    addFeed(countryName) {
      this.isLoading = true;
      var urls = {
        "Europe": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%A8%E3%83%BC%E3%83%AD%E3%83%83%E3%83%91`,
        "America":`http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%A2%E3%83%A1%E3%83%AA%E3%82%AB%E5%90%88%E8%A1%86%E5%9B%BD`,
        "England": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%A4%E3%82%AE%E3%83%AA%E3%82%B9`,
        "Canada": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%AB%E3%83%8A%E3%83%80`,
        "Switzerland": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%B9%E3%82%A4%E3%82%B9`,
        "Australia": `https://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%AA%E3%83%BC%E3%82%B9%E3%83%88%E3%83%A9%E3%83%AA%E3%82%A2`,
        "newZealand": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B8%E3%83%BC%E3%83%A9%E3%83%B3%E3%83%89`,
        "Singapore": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%B7%E3%83%B3%E3%82%AC%E3%83%9D%E3%83%BC%E3%83%AB`,
        "Norway": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%8E%E3%83%AB%E3%82%A6%E3%82%A7%E3%83%BC`,
        "Russia": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%AD%E3%82%B7%E3%82%A2`,
        "Sweden": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%82%B9%E3%82%A6%E3%82%A7%E3%83%BC%E3%83%87%E3%83%B3`,
        "Turkey": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%88%E3%83%AB%E3%82%B3`,
        "SouthAfrica": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E5%8D%97%E3%82%A2%E3%83%95%E3%83%AA%E3%82%AB`,
        "HongKong": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E9%A6%99%E6%B8%AF`,
        "Chinese": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E4%B8%AD%E5%9B%BD`,
        "Denmark": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%87%E3%83%B3%E3%83%9E%E3%83%BC%E3%82%AF`,
        "Mexico": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%A1%E3%82%AD%E3%82%B7%E3%82%B3`,
        "Porland": `http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=rss&q=%E3%83%9D%E3%83%BC%E3%83%A9%E3%83%B3%E3%83%89`
      }
      var url = urls[countryName];

      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=`;
      fetch(`${rssUrl}` + encodeURIComponent(url)).then(res => {
        res.json().then(data => {
          this.isLoading = false;
          const { url } = data.feed;
          const item = this.feedData.find(i => i.url === url);
          const { feed, items } = data;
          if (!item) {
            this.feedData.push({ feed, items });
          }
          if (this.selectedFeed) {
            this.selectedFeed = { feed, items };
          }
          this.feedItems = data.items.concat(this.feedItems);
        });
      });
    }
  }
};
</script>
