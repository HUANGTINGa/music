import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import indexmusic from "../views/indexmusic/index.vue";
import faxianmusic from "../views/faxianmusic/index.vue";
import radiomusic from "../views/radiomusic/index.vue";

export default new Router({
    routes: [
        {
          path: '/indexmusic',
          name: 'icon-music',
          component:indexmusic
        },
        {
          path: '/faxianmusic',
          name: 'icon-wangyiyunyinlezizhi-copy',
          component:faxianmusic
        },
        {
          path: '/radiomusic',
          name: 'icon-diantai',
          component:radiomusic
        },
        {path:"*", redirect:"/indexmusic"}
    ]
})
