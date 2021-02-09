<template>
  <div>
    <div>
      <v-row class="mx-n1">
        <v-col v-for="(video, n) in videos" cols="12" :key="video + n">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <router-link to="">
                <Poster :source="video.poster" />
              </router-link>
            </v-responsive>
            <VideoTitle :video="video" :dense="dense" />
            <v-card-actions class="pt-0">
              <v-btn tile color="accent lighten-2" text>More</v-btn>
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
  </div>
</template>

<script>
import Poster from "./Poster.vue";
import VideoData from "../data/VideoData.json";
import VideoDescription from "./VideoDescription.vue";
import VideoTitle from "./VideoTitle.vue";

export default {
  name: "SuggestionsBox",
  components: { Poster, VideoDescription, VideoTitle },
  data: () => ({
    videos: VideoData,
    show: false,
    dense: true,
    tagsPosition: "top",
  }),
};
</script>