<template>
  <div id="VideoPlayerWrapper" v-if="video.formats[0].url">
    <v-card outlined tile class="ma-2">
      <v-responsive :aspect-ratio="16 / 9" class="responsive">
        <VideoPlayer
          v-if="video.formats[0].url && video.poster"
          class="flex-column"
          :source="video.formats[0].url"
          :poster="video.poster"
        />
      </v-responsive>
    </v-card>
    <VideoTitle v-if="video" :video="video" class="pt-2" />
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
  props: ["video"],
  data() {
    return {
      tagsPosition: "top",
    };
  },
  created() {
    console.log(this.video);
  },
};
</script>