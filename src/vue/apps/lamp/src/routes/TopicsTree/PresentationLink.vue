<template>
  <span class="vc_presentation_link" :class="classObject">
    <span
      v-if="hasPraesentation"
      class="title link"
      :id="`PID_${id}`"
      @click="openPresentation(id)"
      :title="`ID: ${id}`"
      v-html="title"
    />
    <span class="title" v-else v-html="title"/>
    <span v-if="subtitle"> - <span class="subtitle"  v-html="subtitle"/></span>
  </span>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'PresentationLink',
  props: {
    id: {
      type: String
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    hasPraesentation: {
      type: Boolean
    },
    level: {
      type: Number
    }
  },
  methods: {
    async openPresentation (presId) {
      this.$router.push({ name: 'slides-preview', params: { presId: presId } })
    }
  },
  computed: {
    ...mapGetters(['presentation']),
    classObject: function () {
      const result = {}
      result[`level-${this.level}`] = true
      if (this.hasPraesentation && this.presentation && this.id === this.presentation.id) {
        result.active = true
      }
      return result
    }
  }
}
</script>

<style lang="scss">
  .vc_presentation_link {
    &.level-1 .title {
      font-family: $font-family-sans;
      font-size: 1.6em;
      font-weight: bold;
    }

    &.level-2 .title {
      font-family: $font-family-sans;
      font-weight: bold;
      font-size: 1.4em;
    }

    &.level-3 .title {
      font-family: $font-family-sans;
      font-size: 1.2em;
    }
  }
</style>
