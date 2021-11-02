<template>
  <div id="VideoGrid">
    <h1
      v-if="title"
      class="px-2 headline"
    >
      {{ title }}
    </h1>
    <div class="py-2">
      <masonry
        :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }"
        :gutter="16"
      >
        <PreviewCard
          v-for="(video, n) in videos"
          :key="video + n"
          :video="video"
          :no-link="noLink"
          :is-stream="isStream"
          class="mb-4"
        />
        <v-card
          v-if="moreLink"
          tile
          outlined
          elevation="0"
          :to="moreLink"
        >
          <v-responsive :aspect-ratio="16 / 9">
            <v-btn
              width="100%"
              height="100%"
            >
              Show More
            </v-btn>
          </v-responsive>
        </v-card>
      </masonry>
    </div>
  </div>
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";
import { api } from "@/services/api.js";

export default {
  name: "VideoGrid",
  components: {
    PreviewCard,
  },
  props: ["videos", "noLink", "isStream", "moreLink", "title"],
  data() {
    return {
      recordings: [],
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      api.Recordings.List().then(
        (response) => (this.recordings = response.data)
      );
    },
  },
};
</script>
