<template>
  <vue-plyr ref="plyr" :options="playerOptions">
    <video
      controls
      playsinline
      autoplay
      data-poster="poster.jpg"
      class="player"
    >
      <source size="720" :src="source" type="video/mp4" />
    </video>
  </vue-plyr>
</template>

<script>
import Hls from "hls.js";

export default {
  name: "PlyrPlayer",
  props: ["source", "isLive"],
  data() {
    return {
      playerOptions: {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
        settings: ["quality", "speed", "loop"],
      },
    };
  },
  computed: {
    player() {
      console.log(this.$refs.plyr.player);
      return this.$refs.plyr.player;
    },
  },
  mounted() {
    if (this.isLive && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.source);
      hls.attachMedia(this.player.media);

      window.hls = hls;
    }
  },
};
</script>

<style>
:root {
  --plyr-color-main: #51aaaf;
}
</style>