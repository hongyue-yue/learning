import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'

import App from './App'
import store from './vuex/store'


Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)

const router = new VueRouter()

router.map ({
  '/friends':{
        name:'friends',
        component:(resolve)=>{
           require(['./components/friends.vue'],resolve)
    }
  },
  '/near': {
        name: 'near',
        component: (resolve) => {
            require(['./components/near.vue'], resolve)
        }
    },
  '/find':{
        name: 'find',
        component: (resolve) => {
            require(['./components/find.vue'], resolve)
        }
    },
  '/comments':{
          name: 'comments',
          component: (resolve) => {
              require(['./components/comments.vue'], resolve)
          }
      },
  '/newsNote/:id':{
          name: 'newsNote',
          component: (resolve) => {
              require(['./components/newsNote.vue'], resolve)
            }
      },
  '/dynaNote/:id':{
         name:'dynaNote',
         component: (resolve) => {
             require(['./components/dynaNote.vue'], resolve)
         }
  },

})
sync(store, router)
router.start(App,'app')
