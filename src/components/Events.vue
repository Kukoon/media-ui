<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-icon v-if="event" small left> mdi-calendar </v-icon>
    <span v-if="event" class="caption pr-2">{{ "Event:" }}</span>
    <router-link
      v-if="event"
      class="caption"
      :to="{ name: filterView, query: { event: event.id } }"
    >
      <span>{{ event.name }}</span>
    </router-link>
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
