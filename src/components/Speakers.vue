<template>
  <div class="chips d-flex-inline align-start">
    <v-icon v-if="speakers.length > 0" small left> mdi-account </v-icon>
    <span v-if="speakers.length > 0" class="caption pr-2">{{
      "Speakers:"
    }}</span>
    <div
      v-for="(speaker, n) in speakers"
      :key="speaker + n"
      style="display: inline-block"
    >
      <router-link
        color="grey lighten-2"
        class="caption"
        :to="{ name: filterView, query: { speaker: speaker.id } }"
      >
        <span>{{ speaker.name }}</span>
      </router-link>
      <span class="pr-2 caption" v-if="n < speakers.length - 1">{{ "," }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "Speakers",
  props: ["speakers"],
  computed: {
    filterView() {
      return this.$router.history.current.name == "VideoGrid"
        ? "VideoGrid"
        : "VideoList";
    },
  },
};
</script>
