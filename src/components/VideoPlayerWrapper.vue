<template>
  <div id="VideoPlayerWrapper" v-if="video !== null && getSource">
    <VideoTitle v-if="video" :video="video" class="pt-2" />
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
    />
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";
import VideoTitle from "@/components/VideoTitle.vue";
import VideoDescription from "@/components/VideoDescription.vue";

export default {
  name: "VideoPlayerWrapper",
  components: {
    VideoPlayer,
    VideoTitle,
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
        return this.source
      }
      const urls =  this.video.formats.map((i)=> i.url);
      return urls[0];
    },
  },
};
</script>
