/**
 *
 * Waveform visualizers
 *
 * - {@link https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/}
 * - {@link https://waveform.prototyping.bbc.co.uk/}
 * @module @bldr/lamp/masters/audio
 */

import { GrabFromObjects } from '@/lib.js'

export default {
  title: 'Hörbeispiel',
  props: {
    src: {
      type: [String, Array],
      required: true,
      description: 'Eine Medien-Datei-URI, z. B. `id:Fuer-Elise` oder eine Sample-URI (`id:Fuer-Elise#complete`).',
      mediaFileUri: true
    },
    title: {
      type: String,
      markup: true,
      description: 'Der Titel des Audio-Ausschnitts.',
      required: true
    },
    composer: {
      type: String,
      markup: true,
      description: 'Der/Die KomponistIn des Audio-Ausschnitts.'
    },
    artist: {
      type: String,
      markup: true,
      description: 'Der/Die InterpretIn des Audio-Ausschnitts.'
    },
    cover: {
      type: String,
      description: 'Eine Medien-Datei-URI, die als Cover-Bild angezeigt werden soll.',
      mediaFileUri: true
    },
    description: {
      type: String,
      markup: true,
      description: 'Ein längerer Beschreibungstext.'
    },
    autoplay: {
      type: Boolean,
      default: false,
      description: 'Den Audio-Ausschnitt automatisch abspielen.'
    },
    playthrough: {
      type: Boolean,
      default: false,
      description: 'Über die Folien hinwegspielen. Nicht stoppen beim Folienwechsel.'
    }
  },
  icon: {
    name: 'music',
    color: 'brown'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { src: props }
      }
      return props
    },
    resolveMediaUris (props) {
      const uris = new Set([props.src])
      if (props.cover) uris.add(props.cover)
      return uris
    },
    collectPropsMain (props) {
      const sample = this.$store.getters['media/sampleByUri'](props.src)
      const mediaFile = sample.mediaFile

      const grab = new GrabFromObjects(props, mediaFile)
      const artist = grab.property('artist')
      const composer = grab.property('composer')
      const description = grab.property('description')
      let title
      if (props.title) {
        title = props.title
      } else {
        title = sample.titleFormated
      }

      let previewHttpUrl
      if (props.cover) {
        const coverFile = this.$store.getters['media/mediaFileByUri'](props.cover)
        previewHttpUrl = coverFile.httpUrl
      } else if ('previewHttpUrl' in mediaFile) {
        previewHttpUrl = mediaFile.previewHttpUrl
      }
      return {
        sample,
        previewHttpUrl,
        artist,
        composer,
        title,
        description,
        mediaAsset: mediaFile
      }
    },
    titleFromProps ({ props, propsMain }) {
      if (props.title) return props.title
      const asset = propsMain.mediaAsset
      if (asset.title) return asset.title
    },
    // no enterSlide hook: $media is not ready yet.
    async afterSlideNoChangeOnComponent () {
      if (!this.isPublic) return
      const slide = this.$get('slide')
      this.$media.player.load(slide.props.src)
      if (slide.props.autoplay) {
        await this.$media.player.start()
      }
    }
  }
}
