<template>
  <section class="vc_media_table" v-if="typeCount(type)">
    <h2>
      <material-icon
        :name="`file-${type}`"
        :color="typeToColor(type)"
      />
        {{ type }}
    </h2>
    <table>
      <thead>
        <tr>
          <td></td>
          <td>Title</td>
          <td>Shortcut</td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <table-row
          v-for="asset in assetsByType(type)"
          :key="asset.uri"
          :asset="asset"
        />
      </tbody>
    </table>
  </section>
</template>

<script>
import { mediaCategoriesManager } from '../main.js'
import TableRow from './TableRow.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'MediaTable',
  components: {
    TableRow
  },
  props: ['assets', 'type'],
  computed: mapGetters(['assetsByType', 'typeCount']),
  methods: {
    typeToColor (type) {
      return mediaCategoriesManager.typeToColor(type)
    }
  }
}
</script>

<style lang="scss">
  .vc_media_table {
    table {
      width: 100%;
    }
  }
</style>
