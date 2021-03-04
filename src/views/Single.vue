<template>
  <VideoPlayer :source="source" :poster="video.poster" />
</template>

<script>
import axios from "axios";

import VideoPlayer from "@/components/VideoPlayer";

import { config } from "../../config.js";

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
        config.apiURL +
        "stream/" +
        this.$router.history.current.query.id +
        "?lang=de";
      axios.get(apiURL).then((response) => {
        this.video = response.data;
        this.source = config.sourceURL + this.video.channel.id + ".m3u8";
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
