<template>
  <div class="vc_media_player" v-show="show" b-ui-theme="default">
    <div class="player-container">
      <div class="preview-container">
        <img class="preview-image" v-if="asset && asset.previewHttpUrl" :src="asset.previewHttpUrl" />
        <div
          :class="{ fullscreen: videoFullscreen }"
          v-show="asset && asset.type === 'video'"
          class="video-container"
          ref="videoContainer"
          @click="videoToggleFullscreen"
        />
      </div>
      <div class="main-area" v-if="asset">
        <div class="progress-area">
          <div class="progress-bar">
            <div ref="elapsed" class="elapsed" />
          </div>
          <div class="times">
            <div
              v-if="currentTimeSec"
              :class="{ 'current-time': true, 'enlarged': isCurTimeEnlarged }"
              @click="toggleCurTimeSize"
            >{{ formatDuration(sample.currentTimeSec) }}</div>
            <div class="controls">
              <material-icon name="skip-previous" @click.native="$media.playList.startPrevious()" />
              <material-icon v-if="paused" name="play" @click.native="$media.player.start()" />
              <material-icon v-if="!paused" name="pause" @click.native="$media.player.pause()" />
              <material-icon name="skip-next" @click.native="$media.playList.startNext()" />
              <!-- <material-icon name="fullscreen" @click.native="videoToggleFullscreen" /> -->
            </div>
            <div v-if="durationSec" class="ahead-time">-{{ formatDuration(sample.durationRemainingSec) }}</div>
          </div>
        </div>
        <div class="meta-data">
          <div v-if="sample.asset.artist" class="artist-safe" v-html="sample.artistSafe + ': '"/>
          <div class="title-safe" v-html="sample.titleSafe"/>
          <div v-if="sample.yearSafe" class="year-safe">({{ sample.yearSafe }})</div>
        </div>
      </div>
      <p v-else>Es ist keine Medien-Datei geladen.</p>
      <div class="placeholder"></div>
    </div>
    <material-icon class="close" name="close" @click.native="toggle" />
  </div>
</template>

<script>
/* globals compilationTime gitHead */
import { MaterialIcon } from "@bldr/icons";
import { formatDuration } from "./main.js";

export default {
  name: "MediaPlayer",
  components: {
    MaterialIcon
  },
  data() {
    return {
      currentTimeSec: 0,
      durationSec: 0,
      isCurTimeEnlarged: false,
      paused: true,
      show: false,
      videoElement: null,
      videoFullscreen: false
    };
  },
  computed: {
    sample() {
      return this.$store.getters["media/samplePlayListCurrent"];
    },
    asset() {
      if (this.sample) return this.sample.asset;
    },
    mediaElement() {
      if (this.sample) return this.sample.mediaElement;
    },
    no() {
      return this.$store.getters["media/playListNoCurrent"];
    }
  },
  watch: {
    mediaElement() {
      if (!this.mediaElement) return
      this.mediaElement.ontimeupdate = event => {
        this.currentTimeSec = event.target.currentTime;
      };
      this.mediaElement.oncanplaythrough = event => {
        this.durationSec = event.target.duration;
      };
      this.mediaElement.onplay = event => {
        this.paused = false;
      };
      this.mediaElement.onpause = event => {
        this.paused = true;
      };
      if (this.videoElement) this.videoElement.style.display = "none";
      if (this.asset.type === "video") {
        // Make a canvas clone see https://stackoverflow.com/a/24532111/10193818
        //this.mediaElement.style.display = 'block'
        //this.$refs.videoContainer.appendChild(this.mediaElement)
        //this.videoElement = this.mediaElement
      }
    },
    currentTimeSec() {
      if (!this.$refs.elapsed) return
      this.$refs.elapsed.style.width = `${this.sample.progress * 100}%`;
    }
  },
  methods: {
    toggle: function() {
      this.show = !this.show;
    },
    videoToggleFullscreen: function() {
      this.videoFullscreen = !this.videoFullscreen;
    },
    toggleCurTimeSize: function() {
      this.isCurTimeEnlarged = !this.isCurTimeEnlarged;
    },
    formatDuration: function (sec) {
      return formatDuration(sec)
    }
  },
  mounted: function() {
    // Show the media player.
    this.$shortcuts.add(
      "ctrl+alt+m",
      () => {
        this.toggle();
      },
      "Zeige den Medien-Abspieler"
    );
  }
};
</script>

<style lang="scss">
$preview-size: 4em;
$padding: 0.2em;

.vc_media_player {
  background-color: $gray;
  bottom: 0;
  color: $black;
  font-size: 3vmin;
  left: 0;
  padding: $padding;
  position: fixed;
  text-align: left;
  width: 100%;
  z-index: 1;

  .player-container {
    display: flex;

    .preview-container {
      height: $preview-size;

      .preview-image {
        height: $preview-size;
        object-fit: cover;
        width: $preview-size;
      }

      .preview-image,
      .video-container {
        background-color: $black;
      }

      .video-container {
        height: $preview-size;
        width: $preview-size;

        video {
          height: $preview-size;
          object-fit: contain;
          width: $preview-size;
        }
      }
    }

    .main-area {
      margin-left: $padding;
      width: 100%;

      .progress-area {
        .progress-bar {
          background-color: $black;
          height: 0.2em;
          width: 100%;

          .elapsed {
            background: $orange;
            width: 0%;
            height: 100%;
          }
        }

        .times {
          display: flex;
          justify-content: space-between;

          .ahead-time,
          .current-time {
            font-family: sans;
            font-size: 0.5em;
          }

          .current-time.enlarged {
            font-size: 3em;
          }
        }
      }

      .meta-data {
        font-size: 0.7em;
        font-family: $font-family-sans;
        div {
          display: inline-block;
          padding: 0 0.1em;
        }
      }
    }
    .placeholder {
      width: 2em;
    }
  }

  .close {
    position: absolute;
    right: 0.4em;
    top: 0em;
  }
}
</style>
