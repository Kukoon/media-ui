<template>
  <div id="RecordingsGrid">
    <div class="py-2">
      <v-row class="mx-n1">
        <v-col
          v-for="(video, n) in recordings"
          cols="12"
          md="6"
          :key="video + n"
        >
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
import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";

import { mapGetters } from "vuex";

export default {
  name: "RecordingsGrid",
  components: { Poster, VideoDescription, VideoTitle },
  data: () => ({
    selected: [],
    tagsPosition: "top",
  }),
  computed: {
    ...mapGetters(["recordings"]),
  },
};
</script>