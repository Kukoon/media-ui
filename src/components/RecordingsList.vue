<template>
  <div>
    <div class="pa-2" v-for="(video, n) in videos" :key="video + n">
      <v-row dense class="mx-n3">
        <v-col cols="12" sm="4" class="px-3">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <router-link to="">
                <Poster :source="video.poster" />
              </router-link>
            </v-responsive>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" class="px-3">
          <Description :video="video" :tagsPosition="tagsPosition" />
        </v-col>
      </v-row>
      <v-divider
        v-if="n < videos.length - 1"
        class="mb-2 mt-4 mx-16"
      ></v-divider>
    </div>
  </div>
</template>

<script>
import Description from "./Description.vue";
import Poster from "./Poster.vue";
import VideoData from "../data/VideoData.json";

export default {
  name: "RecordingsList",
  components: { Description, Poster },
  data: () => ({
    selected: [],
    videos: VideoData,
    tagsPosition: "bottom",
  }),
};
</script>