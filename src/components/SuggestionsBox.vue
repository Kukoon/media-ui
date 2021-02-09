<template>
  <div>
    <div v-for="(video, n) in videos" :key="video + n">
      <v-row>
        <v-col>
          <v-card tile outlined>
            <router-link to="">
              <Poster :source="video.poster" />
            </router-link>
            <Description :video="video" :dense="dense" />
          </v-card>
        </v-col>
      </v-row>
      <!-- <v-divider
        v-if="n < videos.length - 1"
        class="mb-4 mt-4 mx-16"
      ></v-divider> -->
    </div>
  </div>
</template>

<script>
import Description from "./Description.vue";
import Poster from "./Poster.vue";
import VideoData from "../data/VideoData.json";

export default {
  name: "SuggestionsBox",
  components: { Description, Poster },
  data: () => ({
    videos: VideoData,
    dense: true,
    tagsPosition: "bottom",
  }),
};
</script>