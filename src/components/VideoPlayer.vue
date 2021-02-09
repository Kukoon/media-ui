<template>
  <div>
    <v-card outlined tile>
      <v-responsive :aspect-ratio="16 / 9" class="responsive">
        <v-clappr
          el="player"
          :source="source"
          :options="options"
          @init="oninit"
          @ready="onready"
          @play="onplay"
          @pause="onpause"
          @stop="onstop"
          @ended="onended"
          @fullscreen="onfullscreen"
          @resize="onresize"
          @seek="onseek"
          @volumeupdate="onvolumeupdate"
          @error="onerror"
        />
      </v-responsive>
    </v-card>
  </div>
</template>

<script>
import VClappr from "v-clappr";
import LevelSelector from "@c3voc/clappr-level-selector";

export default {
  name: "VideoPlayer",
  components: {
    VClappr,
  },
  props: ["source", "poster"],
  // Don't use arrow function or 'this.$vuetify' will not be available
  data() {
    return {
      // Disabled as source is now passed as a prop from parent component
      // source: this.source,
      options: {
        poster: this.poster,
        parent: "player",
        width: "100%",
        height: "100%",
        mute: false,
        autoplay: false,
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
      localclappr: null,
    };
  },
  methods: {
    oninit(clappr) {
      console.log(this);
      this.localclappr = clappr;
    },
    onready(event) {
      console.log("inside hook: onready", event);
    },
    onplay(event) {
      console.log("inside hook: onplay", event);
    },
    onpause(event) {
      console.log("inside hook: onpause", event);
    },
    onstop(event) {
      console.log("inside hook: onstop", event);
    },
    onended(event) {
      console.log("inside hook: onended", event);
    },
    onfullscreen(isBool) {
      console.log("player fullscreen?", isBool);
    },
    onresize(resize) {
      console.log("Resized object", resize);
    },
    onseek(time) {
      console.log("on seek, time in seconds:", time);
    },
    /* - do not flood browser with logs
    ontimeupdate(progress) {
      console.log("Progress of played video:", progress);
    },
    */
    onvolumeupdate(volume) {
      console.log("Volume updated, current volume:", volume);
    },
    onerror(e) {
      console.log("le error:", e);
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
