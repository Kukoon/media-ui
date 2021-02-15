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
          <v-expansion-panels flat tile>
            <v-expansion-panel>
              <v-expansion-panel-header
                @click="toggleDescription(video.id)"
                class="pl-2 pr-4 py-2 d-flex"
              >
                <v-btn
                  tile
                  color="accent lighten-2"
                  class="px-1 flex-grow-0"
                  text
                  :ripple="false"
                >
                  {{ show.includes(video.id) ? "Less" : "More" }}
                </v-btn>
                <v-spacer />
              </v-expansion-panel-header>
              <v-expansion-panel-content id="paddingFix">
                <v-divider></v-divider>
                <VideoDescription
                  :video="video"
                  :tagsPosition="tagsPosition"
                  class="pt-3"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VideoData from "@/data/VideoData.json";

import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";

export default {
  name: "Suggestions",
  components: { Poster, VideoDescription, VideoTitle },
  props: ["videos"],
  data() {
    return {
      currentID: this.$router.history.current.query.id,
      dense: true,
      tagsPosition: "top",
      show: [],
      videoData: VideoData,
    };
  },
  methods: {
    toggleDescription(id) {
      // If show array does not include video id, add it to show array
      if (!this.show.includes(id)) {
        this.show.push(id);
      }
      // Else remove element at the index of the video id in the show array
      else {
        const index = this.show.indexOf(id);
        if (index > -1) {
          this.show.splice(index, 1);
        }
      }
    },
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
    },
  },
};
</script>

<style scoped>
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 0 !important;
}

/* see: https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors */
.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>