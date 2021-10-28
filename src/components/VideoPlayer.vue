<template>
  <v-clappr el="player" :source="source" :options="options" @init="oninit" />
</template>

<script>
import LevelSelector from "@c3voc/clappr-level-selector";
import { mapGetters } from "vuex";
import VClappr from "v-clappr";

export default {
  name: "VideoPlayer",
  components: {
    VClappr,
  },
  props: ["source", "poster", "running"],
  // Don't use arrow function or 'this.$vuetify' will not be available
  data() {
    return {
      localclappr: null,
      // Disabled as source is now passed as a prop from parent component
      // source: this.source,
      options: {
        poster: this.poster,
        parent: "player",
        width: "100%",
        height: "100%",
        mute: false,
        // ! Untested
        autoplay: this.autoPlay,
        loop: false,
        smoothing: true,
        disable_keyboard_shortcuts: false,
        disable_context_menu: true,
        mediacontrol: {
          seekbar: this.$vuetify.theme.themes.light.accent.base,
          buttons: this.$vuetify.theme.themes.light.neutral.base,
        },
        ga: {},
        watermark: {},
        plugins: [LevelSelector],
        levelSelectorConfig: {
          labelCallback: (playbackLevel) => {
            if (playbackLevel.level && playbackLevel.level.height) {
              return playbackLevel.level.height + "p";
            } else if (playbackLevel.height) {
              return playbackLevel.height + "p";
            } else {
              return playbackLevel.label;
            }
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters(["autoPlay"]),
  },
  methods: {
    oninit(clappr) {
      this.localclappr = clappr;
      if (this.autoPlay === true) {
        this.localclappr.play();
      }
    },
    play(){
      this.localclappr.play();
    },
    restart(){
      this.localclappr.load(this.source);
      this.localclappr.play();
    },
  },
  watch: {
    running(is, old) {
      if(is && !old){
        console.log("stream goes live: restart it in 30s")
        // start 30s later -> HLS should be ready now
        setTimeout(this.restart, 30000);
      }
    },
    // Watch for changes in the prop 'source' passed from parent component
    source(newSrc) {
      // Load new source into clappr and play
      this.localclappr.load(newSrc);
      this.localclappr.play();
    },
  },
};
</script>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
