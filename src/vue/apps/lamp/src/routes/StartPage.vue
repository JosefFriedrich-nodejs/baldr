<template>
  <div class="vc_start_page main-app-padding main-app-fullscreen" b-ui-theme="default">

    <drop-down-menu v-if="!$isElectron"/>

    <div class="top-icon">
      <div class="logo"><material-icon color="red" name="baldr"/>Baldr</div>
      <div class="subtitle">Software im Browser für den Musikunterricht</div>
    </div>

    <open-interface/>

    <recent-presentations/>

    <section class="sub-projects">
      <a href="/" class="baldr">
        <material-icon color="red" name="baldr"/>
        Baldr
      </a>

      <a href="/presentation/">
        <material-icon color="orange" name="presentation" outline="circle"/>
        Präsentation
      </a>

      <a href="/songbook/">
        <material-icon color="green" name="music" outline="circle"/>
        Liederbuch
      </a>

      <a href="/seating-plan/">
        <material-icon color="blue" name="seat-outline" outline="circle"/>
        Sitzplan
      </a>
    </section>
  </div>
</template>

<script>
import OpenInterface from '@/components/OpenInterface'
import RecentPresentations from '@/components/RecentPresentations'

import DropDownMenu from '@/components/DropDownMenu'

export default {
  name: 'StartPage',
  components: {
    OpenInterface,
    RecentPresentations,
    DropDownMenu
  },
  mounted: function () {
    this.$styleConfig.set()
  }
}
</script>

<style lang="scss">
  .vc_start_page {
    font-size: 2vw;
    display: table;

    .vc_open_interface {
      display: table-cell;
      vertical-align: middle;
    }

    .sub-projects {
      position: absolute;
      bottom: 3vw;
      left: 0;
      width: 100%;
      text-align: center;

      .baldr-icon_baldr {
        font-size: 6vw;
        transform: translate(0, 1.3vw);
      }

      a {
        padding-right: 1vw;
      }

      .baldr {
        padding-right: 3vw;
      }
    }

    .top-icon {
      width: 100%;
      left: 0vw;
      position: absolute;
      text-align: center;
      top: 5vw;

      .logo {
        font-size: 10vw;
        font-family: $font-family-sans-small-caps;
        color: $red;
      }
    }

    .vc_drop_down_menu {
      position: absolute;
      top: 1vw;
      left: 1vw;
      font-size: 0.8em;
    }
  }
</style>
