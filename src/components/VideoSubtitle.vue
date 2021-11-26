<template>
  <div>
    <v-card-subtitle
      class="pb-0 pt-0 mt-n2 px-4"
      :class="[dense === true ? 'text-truncate' : null]"
    >
      <span v-if="video.lang">{{ video.lang.subtitle }}</span>
    </v-card-subtitle>
  </div>
</template>

<script>
export default {
  name: "VideoSubtitle",
  props: ["video", "dense"],
};
</script>
