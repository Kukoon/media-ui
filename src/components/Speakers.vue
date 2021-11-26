<template>
  <div class="chips d-flex-inline align-start">
    <v-chip
      v-for="(speaker, n) in speakers"
      :key="speaker + n"
      small
      class="mr-2 my-1 pr-2"
      dark
      color="grey darken-1"
      label
      outlined
      :title="speaker.organisation"
      :to="{ name: filterView, query: { speaker: speaker.id } }"
    >
      <v-icon small left> mdi-account </v-icon>
      <span style="margin-bottom: -2px">{{ speaker.name }}</span>
    </v-chip>
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
