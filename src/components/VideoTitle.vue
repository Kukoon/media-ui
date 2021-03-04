<template>
  <v-card-title
    v-if="video.lang"
    class="pt-0 pb-1"
    :class="[
      dense === true ? 'text-truncate dense-text pt-2' : 'no-word-break',
    ]"
  >
    {{ video.lang.title }}
  </v-card-title>
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
}
.no-word-break {
  word-break: normal !important;
}
</style>
