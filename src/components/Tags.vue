<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-icon v-if="tags" small left> mdi-label </v-icon>
    <span v-if="tags" class="caption pr-2">{{ "Tags:" }}</span>
    <div v-for="(tag, n) in tags" :key="tag + n" style="display: inline-block">
      <router-link
        v-if="tag.lang !== null"
        style="margin-bottom: -2px"
        color="text lighten-3"
        class="caption"
        :to="{ name: filterView, query: { tag: tag.id } }"
      >
        <span>{{ tag.lang.name }}</span>
      </router-link>
      <span class="pr-2 caption" v-if="n < tags.length - 1">{{ "," }}</span>
    </div>
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
