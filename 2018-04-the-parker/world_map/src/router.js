import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Worldmap from './views/worldmap.vue'
import WorldName from './views/worldName.vue'
import exchange from './views/exchange.vue'
import windowDisp from './views/windowDisp.vue'
import News from './views/News.vue'
import timer from './views/timerCounter.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/worldmap',
      name: 'worldmap',
      component: Worldmap
    },
    {
      path: '/worldName',
      name: 'worldName',
      component: WorldName
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: exchange
    },
    {
      path: '/window',
      name: 'window',
      conponent: windowDisp
    },
    {
      path: '/News',
      name: 'News',
      component: News
    },
    {
      path: '/timer',
      name: 'timer',
      component: timer
    }
  ]
})
