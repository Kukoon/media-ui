<template>
  <div id="player_id">
  </div>
</template>

<script>
import OvenPlayer from "ovenplayer";

import Hls from "hls.js";
window.Hls = Hls;

export default {
  name: "VideoPlayer",
  props: ["sources", "poster", "running"],
  // Don't use arrow function or 'this.$vuetify' will not be available
  data() {
    return {
      player: null,
      // Disabled as source is now passed as a prop from parent component
      // source: this.source,
      options: {
        image: this.poster,
        autoStart: this.running,
	sources: this.sources,
      },
    };
  },
  watch: {
    running(is, old) {
      if(is) {
        if(!old){
          console.log("stream goes live: restart it in 30s")
          // start 30s later -> HLS should be ready now
          setTimeout(this.restart, 30000);
	}
      }
    },
    // Watch for changes in the prop 'sources' passed from parent component
    sources(newSrc) {
      this.player.load(newSrc);
      this.player.play();
    },
  },
  mounted() {
    if(this.player) {
      this.player.remove();
      this.player = null;
    }
    this.player = OvenPlayer.create('player_id', this.options);
  },
  methods: {
    play(){
      this.player.play();
    },
    restart(){
      this.player.stop();
      this.player.seek(0);
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
