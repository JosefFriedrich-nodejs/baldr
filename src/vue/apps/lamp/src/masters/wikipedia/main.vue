<template>
  <div class="vc_wikipedia_master main-app-padding">
    <div class="title-header" >
      <h1>Wikipedia-Artikel: <em>{{ titleWithoutUnderscores }}</em></h1>
      <a :href="httpUrl">{{ linkTitle }}</a>
    </div>
    <div v-html="body"/>
  </div>
</template>

<script>
import { getHtmlBody } from './main.js'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    language: {
      type: String
    },
    oldid: {
      type: Number
    },
    httpUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    titleWithoutUnderscores () {
      return this.title.replace(/_/g, ' ')
    },
    linkTitle () {
      let oldid = ''
      if (this.oldid) oldid = ` (Version ${this.oldid})`
      const title = this.title.replace(/ /g, '_')
      return `${this.language}:${title}${oldid}`
    },
    body () {
      const master = this.$masters.get(this.masterName)
      return master.$get('bodyById', this.id)
    }
  },
  mounted: async function () {
    const master = this.$masters.get(this.masterName)
    const body = master.$get('bodyById', this.id)
    if (!body) {
      const body = await getHtmlBody(this.title, this.language)
      master.$commit('addBody', { id: this.id, body })
    }
  }
}
</script>
<style lang="scss">
  // https://de.wikipedia.org/wiki/Wikipedia:Technik/Skin/CSS/Selektoren_unter_MediaWiki
  // https://de.wikipedia.org/wiki/Wikipedia:Technik/Skin/MediaWiki#wmfCSS
  .vc_wikipedia_master {

    .title-header {
      display: flex;
      justify-content: space-between;

      h1 {
        margin-top: 0;
      }
    }

    // Belege fehlen
    .noprint,
    // Personendaten
    .metadata,
    // "Beethoven" redirects here. For other uses, see Beethoven (disambiguation).
    .hatnote,
    // Citations
    .reflist,
    // First Viennese School
    // - Joseph Haydn
    // - Wolfgang Amadeus Mozart
    // - Ludwig van Beethoven
    // - Franz Schubert
    .navbox,
    // Hochgestellte Zahlen zu den Zitaten
    sup.reference {
      display: none;
    }

    .tleft, .float-left {
      clear: left; // To avoid stacked floats
      float: left;
    }

    .tright, .infobox, .float-right {
      clear: right; // To avoid stacked floats
      float: right;
    }

    .tleft {
      margin-right: 1em;
    }

    .tright {
      margin-left: 1em;
    }

    .thumbcaption {
      font-size: 0.7em;
    }

    // Overwrite default theme
    tr {
      border: none !important;
    }

  }
</style>
