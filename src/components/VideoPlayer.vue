<template>
  <v-card class="pa-2 mx-4 my-6" outlined tile>
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
        @timeupdate="ontimeupdate"
        @volumeupdate="onvolumeupdate"
        @error="onerror"
      />
    </v-responsive>
  </v-card>
</template>

<script>
import VClappr from "v-clappr";

export default {
  name: "VideoPlayer",
  components: {
    VClappr,
  },
  data: () => ({
    source: "https://v2.media.kukoon.de/stream/hls/live.m3u8",
    options: {
      poster:
        "https://static.media.ccc.de/media/documentation/AllCreaturesWelcome/acw_logo_quad.png",
      parent: "player",
      width: "100%",
      height: "100%",
      mute: false,
      autoplay: false,
      loop: false,
      disable_keyboard_shortcuts: false,
      disable_context_menu: true,
      mediacontrol: { seekbar: "#E113D3", buttons: "#66B2FF" },
      ga: {},
      watermark: {},
      plugins: [],
    },
    localclappr: null,
  }),
  methods: {
    oninit(clappr) {
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
    ontimeupdate(progress) {
      console.log("Progress of played video:", progress);
    },
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