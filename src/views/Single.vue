<template>
  <VideoPlayer :source="source" :poster="video.poster" />
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";

import { config } from "../../config.js"; // HLS url
import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Single",
  props: ['id'],
  components: { VideoPlayer },
  data() {
    return {
      sourceURL: null,
      video: null,
      tagsPosition: "top",
      currentID: null,
    };
  },
  methods: {
    load() {
      api.GetStream(this.id).then((response) => {
        // skip websocket binding on existing stream
        if (this.video == null || response.data.channel.id != this.video.channel.id) {
          websocket.joinHandler(response.data.channel.id, 'status', (ev) => {
            this.video.viewers = ev.viewers;
            if (ev.stream != this.video.id) {
              console.log("new stream description", ev.stream, this.video.channel.id)
              this.loadStream()
            }
            this.video.running = ev.running;
          })
        }
        // update description 
        this.video = response.data;
        this.source = config.sourceURL.replace("{ID}", this.video.channel.id);
      });
    },
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.load();
  },
};
</script>
