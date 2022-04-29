<template>
  <div
    v-if="video !== null && getSources"
    id="VideoPlayerWrapper"
  >
    <v-card-title
      v-if="video.lang"
      class="pt-2 pb-1 title"
    >
      {{ video.lang.title }}
    </v-card-title>
    <VideoSubtitle
      :video="video"
      :class="darkMode ? 'subtitle-color-dark' : 'subtitle-color-light'"
    />
    <v-card
      outlined
      tile
      class="ma-4"
    >
      <v-responsive
        :aspect-ratio="16 / 9"
        class="responsive"
      >
        <VideoPlayer
          v-if="getSources && video.poster"
          ref="player"
          class="flex-column"
          :sources="getSources"
          :poster="video.poster"
          :running="video.running"
        />
      </v-responsive>
    </v-card>
    <VideoDescription
      v-if="video"
      :video="video"
      :tags-position="tagsPosition"
      :long="true"
      class="px-4"
    />
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";
import VideoSubtitle from "@/components/VideoSubtitle.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import { mapGetters } from "vuex";

export default {
  name: "VideoPlayerWrapper",
  components: {
    VideoPlayer,
    VideoDescription,
    VideoSubtitle,
  },
  props: ["video", "sources"],
  data() {
    return {
      tagsPosition: "top",
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
    getSources() {
      if (this.sources) {
        return this.sources;
      }
      return this.video.formats.map((i) => {return {
        "type": "mp3",
        "file": i.url,
	"label": (i.is_video ? "Video " : "Audio ") + i.resolution
      }});
    },
  },
  methods: {
    play() {
      this.$refs.player.play()
    }
  },
};
</script>


<style scoped>
.title {
  word-break: normal !important;
}
.subtitle-color-dark {
  color: rgba(255, 255, 255, 0.7);
}
.subtitle-color-light {
  color: rgba(0, 0, 0, 0.6);
}
</style>
