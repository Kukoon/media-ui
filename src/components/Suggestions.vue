<template>
  <v-col>
    <h3 class="mx-2 mt-2">Suggestions</h3>
    <v-divider class="mx-2 mb-4 mt-2" />
    <div class="hidden-sm-and-down">
      <v-row
        class="mx-n1"
        v-for="(video, n) in suggestions"
        cols="12"
        :key="video + n"
        :class="n === suggestions.length - 1 ? 'mb-6' : null"
      >
        <v-col class="pb-1">
          <PreviewCard :video="video" />
        </v-col>
      </v-row>
    </div>
    <VideoList class="hidden-md-and-up" :videos="suggestions" />
  </v-col>
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";
import VideoList from "@/components/VideoList";

import { api } from "@/services/api.js";

export default {
  name: "Suggestions",
  components: { PreviewCard, VideoList },
  props: ["video"],
  data() {
    return {
      recordings: [],
    };
  },
  computed: {
    suggestions() {
      const result = this.recordings.filter(
        (recording) => recording.id != this.video.id
      );
      return result.slice(0, 3);
    },
  },
  methods: {
    load() {
      api.ListRecordingsSuggestion(this.video).then((response) => (this.recordings = response.data))
    },
  },
  watch: {
    video() {
      this.load()
    },
  },
  created() {
     if (this.video) {
      this.load()
    }
  },
};
</script>
