/**
 * Setup vue router
 *
 * @module @bldr/lamp/router
 */
import Vue from 'vue'
import Router from 'vue-router'

// Components.
import StartPage from './views/StartPage.vue'

import OpenInterface from '@/components/OpenInterface'
import RestApiOverview from '@/views/RestApiOverview.vue'

import DocumentationOverview from '@/views/DocumentationOverview.vue'
import MasterDocumentation from '@/views/MasterDocumentation.vue'
import CommonExample from '@/views/CommonExample.vue'

import SlideView from '@/views/SlideView'
import MasterRenderer from '@/views/SlideView/MasterRenderer.vue'
import SlidesPreview from '@/views/SlidesPreview/index.vue'

import PresentationOverview from '@/views/PresentationOverview/index.vue'

import MediaIdsParentDir from '@/views/MediaIdsParentDir'

// Failed to load chunks in the subfolder presentation
// const Documentation = () => import(/* webpackChunkName: "documentation" */ '@/views/Documentation.vue')
// const MasterDocumentation = () => import(/* webpackChunkName: "documentation" */ '@/views/MasterDocumentation.vue')

// const SlideView = () => import(/* webpackChunkName: "slides" */ '@/views/SlideView')
// const MasterRenderer = () => import(/* webpackChunkName: "slides" */ '@/views/SlideView/MasterRenderer.vue')

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: StartPage,
    meta: {
      shortcut: 'h',
      title: 'Startseite'
    }
  },
  {
    path: '/open',
    component: OpenInterface,
    name: 'open',
    meta: {
      title: 'Präsentation/Medien-Dateien öffnen'
    }
  },
  {
    path: '/slides',
    name: 'slides',
    component: SlideView,
    meta: {
      shortcut: 's',
      title: 'Folien'
    }
  },
  {
    path: '/pres-id/:presId',
    name: 'slides',
    component: SlideView,
    name: 'open-by-pres',
    meta: {
      title: 'Folien'
    },
    children: [
      {
        path: 'slide-no/:slideNo',
        component: SlideView,
        name: 'open-by-slide',
        children: [
          {
            path: 'step-no/:stepNo',
            name: 'open-by-step',
            component: SlideView
          }
        ]
      }
    ]
  },
  {
    path: '/slides/preview',
    component: SlidesPreview,
    name: 'slides-preview',
    meta: {
      shortcut: 'o',
      title: 'Überblick über alle Folien'
    }
  },
  {
    path: '/presentation-overview',
    component: PresentationOverview,
    name: 'presentation-overview',
    meta: {
      shortcut: 'p',
      title: 'Überblick über alle Presentation'
    }
  },
  {
    path: '/ad-hoc/camera',
    name: 'camera',
    component: MasterRenderer,
    meta: {
      title: 'Dokumentenkamera',
      master: 'camera',
      shortcut: 'c'
    }
  },
  {
    path: '/ad-hoc/editor',
    name: 'editor',
    component: MasterRenderer,
    meta: {
      title: 'Hefteintrag',
      master: 'editor',
      shortcut: 'e'
    }
  },
  {
    path: '/documentation',
    component: DocumentationOverview,
    name: 'documentation',
    meta: {
      title: 'Dokumentation',
      shortcut: 'd'
    }
  },
  {
    path: '/documentation/common/:exampleName',
    name: 'common-example',
    component: CommonExample,
    meta: {
      title: 'Allgemeines Beispiel'
    }
  },
  {
    path: '/documentation/master/:master',
    name: 'documentation-master',
    component: MasterDocumentation,
    meta: {
      title: 'Master Documentation'
    }
  },
  {
    path: '/rest-api',
    name: 'rest-api',
    component: RestApiOverview,
    meta: {
      shortcut: 'r',
      title: 'Überblick REST-API-Server'
    }
  },
  {
    path: '/media-ids',
    name: 'media-ids',
    component: MediaIdsParentDir,
    meta: {
      shortcut: 'i',
      title: 'Medien-IDs im übergeordneten Ordner'
    }
  }
]

export default new Router({
  routes
})
