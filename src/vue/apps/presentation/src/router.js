import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

// Components.
import MasterRenderer from '@/views/SlideView/MasterRenderer.vue'
import Documentation from '@/views/Documentation.vue'
import MasterDocumentation from '@/views/MasterDocumentation.vue'
import OpenFiles from '@/views/OpenFiles.vue'
import SlideView from '@/views/SlideView'
import RestApiOverview from '@/views/RestApiOverview.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    title: 'Home',
    shortcut: 'h',
    component: Home
  },
  {
    path: '/open',
    title: 'Open',
    component: OpenFiles
  },
  {
    path: '/slides',
    shortcut: 's',
    title: 'slides',
    component: SlideView
  },
  {
    path: '/camera',
    title: 'camera',
    shortcut: 'c',
    component: MasterRenderer,
    meta: {
      master: 'camera'
    }
  },
  {
    path: '/documentation',
    title: 'Documentation',
    shortcut: 'd',
    component: Documentation
  },
  {
    path: '/documentation/:master',
    name: 'documentation-master',
    title: 'Master Documentation',
    component: MasterDocumentation
  },
  {
    path: '/rest-api',
    name: 'rest-api',
    shortcut: 'r',
    title: 'REST-API',
    component: RestApiOverview
  }
]

export default new Router({
  routes
})
