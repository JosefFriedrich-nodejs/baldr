<template>
  <main>
    <section class="main-project-logo">
       <material-icon name="baldr" color="red"/>
    </section>

    <section class="sub-projects">
      <material-icon
        color="orange"
        href="/presentation"
        name="presentation"
        outline="circle"
      />

      <material-icon
        color="green"
        href="/songbook"
        name="music"
        outline="circle"
      />

      <material-icon
       color="blue"
       href="/seating-plan"
       name="seat-outline"
       outline="circle"
      />
    </section>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HomeView extends Vue {
}
</script>

<style lang="scss" scoped>
  .main-project-logo {
    text-align: center;
  }
  .baldr-icon_baldr {
    font-size: 50vw;
    color: $purple !important;
  }

  .sub-projects {
    display: flex;
    justify-content: space-around;

    .baldr-icon {
      font-size: 10vw;
    }
  }
</style>
