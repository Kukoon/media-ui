<template>
  <div>
    <div class="pa-2" v-for="(video, n) in videos" :key="video + n">
      <v-row dense class="mx-n3">
        <v-col cols="12" md="4" class="px-3">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <router-link to="">
                <Poster :source="video.poster" />
              </router-link>
            </v-responsive>
          </v-card>
        </v-col>
        <v-col cols="12" md="8" class="px-3">
          <Description :meta="video" :chipsPosition="chipsPosition" />
        </v-col>
      </v-row>
      <v-divider v-if="n < videos.length - 1" class="my-6 mx-16"></v-divider>
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
    chipsPosition: "bottom",
  }),
};
</script>