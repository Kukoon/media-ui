<template>
  <div id="suggestions">
    <v-row
      class="mx-n1"
      v-for="(video, n) in videos"
      cols="12"
      :key="video + n"
      :class="n === videos.length - 1 ? 'mb-6' : null"
    >
      <v-col class="pb-1">
        <PreviewCard :video="video" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";

export default {
  name: "Suggestions",
  components: { PreviewCard },
  props: ["videos"],
  data() {
    return {
      currentID: this.$router.history.current.query.id,
    };
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
    },
  },
};
</script>
