<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-chip
      v-for="(tag, n) in tags"
      :key="tag + n"
      small
      class="mr-2 my-1 pr-2"
      label
      :to="{ name: filterView, query: { tag: tag.id } }"
    >
      <v-icon small left> mdi-label </v-icon>
      <span v-if="tag.lang !== null" style="margin-bottom: -2px">
        {{ tag.lang.name }}
      </span>
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "Tags",
  props: ["tags"],
  computed: {
    filterView() {
      return this.$router.history.current.name == "VideoGrid"
        ? "VideoGrid"
        : "VideoList";
    },
  },
};
</script>
