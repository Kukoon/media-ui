<template>
  <div>
    <v-card-title
      v-if="video.description"
      class="pt-0"
      :class="[
        video.description.subtitle !== undefined ? 'pb-4' : 'pb-1',
        // add classes if dense
        dense === true ? 'dense-text text-truncate pt-2' : null,
      ]"
    >
      {{ video.description.title }}
    </v-card-title>
    <v-card-subtitle
      v-if="video.description"
      class="pb-4"
      :class="[dense === true ? 'text-truncate' : null]"
    >
      {{ video.description.subtitle }}
    </v-card-subtitle>
  </div>
</template>

<script>
export default {
  name: "VideoTitle",
  props: ["video", "dense"],
};
</script>

<style scoped>
.dense-text {
  overflow: hidden;
  font-size: 1rem !important;
  text-overflow: ellipsis !important;
}
</style>