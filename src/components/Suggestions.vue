<template>
  <div id="suggestions">
    <v-row
      class="mx-n1"
      v-for="(video, n) in videos"
      cols="12"
      :key="video + n"
    >
      <v-col>
        <v-card outlined tile elevation="0">
          <v-responsive :aspect-ratio="16 / 9">
            <Poster :source="video.poster" :videoID="video.id" />
          </v-responsive>
          <VideoTitle :video="video" :dense="dense" />
          <v-card-actions class="pt-0">
            <v-btn tile color="accent lighten-2" text @click="show = !show">
              {{ show ? "Less" : "More" }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="show = !show">
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <VideoDescription
                :video="video"
                :tagsPosition="tagsPosition"
                class="pt-3"
              />
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Poster from "./Poster.vue";
import VideoData from "../data/VideoData.json";
import VideoDescription from "./VideoDescription.vue";
import VideoTitle from "./VideoTitle.vue";

export default {
  name: "Suggestions",
  components: { Poster, VideoDescription, VideoTitle },
  data() {
    return {
      currentID: this.$router.history.current.query.id,
      dense: true,
      tagsPosition: "top",
      show: false,
      videoData: VideoData,
    };
  },
  computed: {
    videos() {
      const videos = this.videoData.filter(
        (video) => video.id != this.currentID
      );
      return videos;
    },
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
    },
  },
};
</script>