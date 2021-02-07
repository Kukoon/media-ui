<template>
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
</template>

<script>
import VClappr from "v-clappr";

export default {
  name: "VideoPlayer",
  components: {
    VClappr,
  },
  data: () => ({
    source:
      "https://koeln.cdn.media.ccc.de/documentation/AllCreaturesWelcome/h264-hd/AllCreaturesWelcome-9997-deu-All_Creatures_Welcome_hd.mp4",
    options: {
      parent: ".player",
      // width: "auto",
      poster:
        "https://static.media.ccc.de/media/documentation/AllCreaturesWelcome/acw_logo_quad.png",
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