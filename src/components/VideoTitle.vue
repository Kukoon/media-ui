<template>
  <router-link
    :to="{ name: 'Player', params: { id: video.id } }"
    class="title-link px-0 dense-text"
    :title="video.lang.title"
  >
    <v-card-title
      v-if="video.lang"
      class="pt-0 pb-1 dense-text text-truncate"
      :class="dense ? 'pt-2' : 'pt-0'"
    >
      {{ video.lang.title }}
    </v-card-title>
  </router-link>
</template>

<script>
export default {
  name: "VideoTitle",
  props: ["video", "dense"],
};
</script>

<style scoped>
.dense-text {
  font-size: 1rem !important;
  text-overflow: ellipsis !important;
  display: block !important;
  word-break: normal;
}

.title-link {
  text-decoration: none;
  color: var(--v-theme-text-base);
  display: inline-block;
}
</style>
