<template>
  <VideoPlayer :source="source" :poster="poster" />
</template>

<script>
import video from "@/data/VideoData.json";

import VideoPlayer from "@/components/VideoPlayer";

export default {
  name: "Single",
  components: { VideoPlayer },
  data() {
    return {
      sourceURL: "https://v2.media.kukoon.de/stream/hls/",
      poster:
        "https://media.kukoon.de/images/5b20a25a-7b57-4d0b-883c-c29c3075e5dd.jpg",
      video: video[2],
      tagsPosition: "top",
      currentID: null,
    };
  },
  computed: {
    source() {
      return this.sourceURL + this.currentID + ".m3u8";
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.currentID = this.$router.history.current.query.id;
  },
};
</script>