<template>
  <div id="VideoGrid">
    <div class="py-2">
      <masonry :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }" :gutter="16">
        <PreviewCard
          v-for="(video, n) in videos"
          :key="video + n"
          :video="video"
          :noLink="noLink"
          :isStream="isStream"
          class="mb-4"
        />
        <v-card
          v-if="videos.length < recordings.length"
          tile
          outlined
          elevation="0"
        >
          <v-responsive :aspect-ratio="16 / 9">
            <v-btn width="100%" height="100%" @click="showMore()"
              >Show More</v-btn
            >
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
  props: ["videos", "noLink", "isStream"],
  data() {
    return {
      recordings: [],
    };
  },
  methods: {
    load() {
      api.Recordings.List().then(
        (response) => (this.recordings = response.data)
      );
    },
    showMore() {
      this.$emit("showMore");
    },
  },
  created() {
    this.load();
  },
};
</script>
