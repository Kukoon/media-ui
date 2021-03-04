<template>
  <div id="VideoPlayerWrapper" v-if="video !== null && getSource">
    <v-card-title v-if="video.lang" class="pt-2 pb-1 title">
      {{ video.lang.title }}
    </v-card-title>
    <v-card outlined tile class="ma-4">
      <v-responsive :aspect-ratio="16 / 9" class="responsive">
        <VideoPlayer
          v-if="getSource && video.poster"
          class="flex-column"
          :source="getSource"
          :poster="video.poster"
        />
      </v-responsive>
    </v-card>
    <VideoDescription
      v-if="video"
      :video="video"
      :tagsPosition="tagsPosition"
      :long="true"
      class="px-4"
    />
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";
// import VideoTitle from "@/components/VideoTitle.vue";
import VideoDescription from "@/components/VideoDescription.vue";

export default {
  name: "VideoPlayerWrapper",
  components: {
    VideoPlayer,
    VideoDescription,
  },
  props: ["video", "source"],
  data() {
    return {
      tagsPosition: "top",
    };
  },
  computed: {
    getSource() {
      if (this.source) {
        return this.source;
      }
      const urls = this.video.formats.map((i) => i.url);
      return urls[0];
    },
  },
};
</script>


<style scoped>
.title {
  word-break: normal !important;
}
</style>