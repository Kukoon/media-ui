<template>
  <VideoPlayer :source="source" :poster="video.poster" />
</template>

<script>
import axios from "axios";

import VideoPlayer from "@/components/VideoPlayer";

import { config } from "../../config.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Single",
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
    loadStream() {
      const apiURL =
        config.apiURL + "/stream/" + this.$router.history.current.query.id;
      axios.get(apiURL).then((response) => {
        this.video = response.data;
        websocket.join(this.video.channel.id)
        this.source = config.sourceURL.replace("{ID}", this.video.channel.id);
      });
    },
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
      this.loadStream();
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.currentID = this.$router.history.current.query.id;
    this.loadStream();
  },
};
</script>
