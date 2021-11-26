<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-chip
      v-if="event"
      label
      small
      color="orange"
      class="mr-2 my-1 pr-2"
      :to="{ name: filterView, query: { event: event.id } }"
    >
      <v-icon small left> mdi-calendar </v-icon>
      {{ event.name }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "Events",
  props: ["event"],
  computed: {
    filterView() {
      return this.$router.history.current.name == "VideoGrid"
        ? "VideoGrid"
        : "VideoList";
    },
  },
};
</script>
