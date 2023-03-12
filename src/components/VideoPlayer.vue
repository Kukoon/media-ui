<template>
  <div id="player_id"></div>
</template>

<script>
import OvenPlayer from "ovenplayer";

import Hls from "hls.js";
window.Hls = Hls;

export default {
  name: "VideoPlayer",
  props: ["sources", "poster", "running", "autostart"],
  // Don't use arrow function or 'this.$vuetify' will not be available
  data() {
    return {
      player: null,
      // Disabled as source is now passed as a prop from parent component
      // source: this.source,
      options: {
        image: this.poster.url,
        autoStart: this.autostart,
        sources: this.sources,
        hlsConfig: {
          xhrSetup: function (xhr) {
            xhr.withCredentials = true;
          }
        }
      },
    };
  },
  watch: {
    running(is, old) {
      if (is && !old){
        console.log("stream goes live: restart/reset it")
        this.restart();
      }
    },
    // Watch for changes in the prop 'sources' passed from parent component
    sources(newSrc) {
      this.player.load(newSrc);
      if (this.autostart) {
        this.play();
      }
    },
  },
  mounted() {
    if (this.player) {
      this.player.remove();
      this.player = null;
    }
    this.player = OvenPlayer.create('player_id', this.options);
    this.player.on("sourceChanged", this.player.play);
  },
  methods: {
    play(){
      this.player.play();
    },
    restart(){
      if (this.player) {
        this.player.remove();
        this.player = null;
      }
      this.player = OvenPlayer.create('player_id', this.options);
      this.player.on("sourceChanged", this.player.play);
      this.player.play();
    },
  },
};
</script>

<style>
#player_id {
  width: 100%;
  height: 100%;
  --op-accent-color: red;
}
</style>
