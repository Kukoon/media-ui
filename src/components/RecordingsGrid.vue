<template>
  <div id="RecordingsGrid">
    <div class="py-2">
      <v-row class="mx-n1">
        <v-col v-for="(video, n) in videos" cols="12" md="6" :key="video + n">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <Poster :source="video.poster" :videoID="video.id" />
            </v-responsive>
            <VideoTitle :video="video" class="pt-4" />
            <VideoDescription :video="video" :tagsPosition="tagsPosition" />
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
  name: "RecordingsGrid",
  components: { Poster, VideoDescription, VideoTitle },
  data: () => ({
    selected: [],
    videos: VideoData,
    tagsPosition: "top",
  }),
};
</script>