<template>
  <plyrue ref="plyr" :options="playerOptions">
    <video
      controls
      playsinline
      autoplay
      data-poster="poster.jpg"
      class="player"
    >
      <source size="720" :src="source" type="video/mp4" />
    </video>
  </plyrue>
</template>

<script>
import { PlyrueComponent as Plyrue } from "plyrue";
import Hls from "hls.js";

export default {
  name: "PlyrPlayer",
  props: ["source", "isLive"],
  components: { Plyrue },
  data() {
    return {
      hls: null,
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
    video() {
      return this.$refs.video;
    },
  },
  watch: {
    source() {
      console.log(this.isLive);
      if (this.isLive === true && !Hls.isSupported()) {
        this.video.src = this.source;
      } else {
        const hls = new Hls();
        this.hls = hls;
        hls.loadSource(this.source);
        hls.attachMedia(this.video);
        this.$once("hook:beforeDestroy", () => {
          hls.stopLoad();
          hls.destroy();
        });
      }
    },
  },
};
</script>

<style>
:root {
  --plyr-color-main: #51aaaf;
}
</style>