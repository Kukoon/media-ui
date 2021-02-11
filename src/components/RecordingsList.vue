<template>
  <div id="RecordingsList">
    <div class="pa-2" v-for="(video, n) in videos" :key="video + n">
      <v-row dense class="mx-n3">
        <v-col cols="12" sm="4" class="px-3">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <Poster :source="video.poster" :videoID="video.id" />
            </v-responsive>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" class="px-3">
          <VideoTitle :video="video" />
          <VideoDescription :video="video" :tagsPosition="tagsPosition" />
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
import VideoData from "@/data/VideoData.json";

import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";

export default {
  name: "RecordingsList",
  components: { Poster, VideoDescription, VideoTitle },
  data: () => ({
    selected: [],
    videos: VideoData,
    tagsPosition: "bottom",
  }),
};
</script>