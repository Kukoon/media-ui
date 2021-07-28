<template>
  <div>
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
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";

import { api } from "@/services/api.js";

export default {
  name: "Suggestions",
  components: { PreviewCard },
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
      console.log(this.video);
      api.ListRecordingsSuggestion(this.video).then((response) => (this.recordings = response.data))
    },
  },
  watch: {
    video() {
      this.load()
    },
  },
  created() {
    this.load()
  },
};
</script>
