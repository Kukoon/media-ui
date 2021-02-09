<template>
  <div>
    <div class="py-2">
      <v-row class="mx-n1">
        <v-col v-for="(video, n) in videos" cols="12" md="6" :key="video + n">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <router-link to="">
                <Poster :source="video.poster" />
              </router-link>
            </v-responsive>
            <Description :meta="video" :chipsPosition="chipsPosition" />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Description from "./Description.vue";
import Poster from "./Poster.vue";
import VideoData from "../data/VideoData.json";

export default {
  name: "RecordingsGrid",
  components: { Description, Poster },
  data: () => ({
    selected: [],
    videos: VideoData,
    chipsPosition: "top",
  }),
};
</script>