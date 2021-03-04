<template>
  <v-card-subtitle
    v-if="video.lang"
    class="pb-0 pt-0 mt-n2"
    :class="[dense === true ? 'text-truncate' : null]"
  >
    {{ video.lang.subtitle }}
  </v-card-subtitle>
</template>

<script>
export default {
  name: "VideoSubtitle",
  props: ["video", "dense"],
};
</script>
