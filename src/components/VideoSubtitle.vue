<template>
  <v-card-subtitle
    class="pb-0 pt-0 mt-n2 px-4"
    :class="[dense === true ? 'text-truncate' : null]"
  >
    <span v-if="video.lang">{{ video.lang.subtitle }}</span>
    <span v-if="video.start_at">
      {{ readableDate + " @ " + readableTime }}
    </span>
  </v-card-subtitle>
</template>

<script>
export default {
  name: "VideoSubtitle",
  props: ["video", "dense"],
  computed: {
    readableDate() {
      const date = new Date(this.video.start_at);
      var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString([], options);
    },
    readableTime() {
      const date = new Date(this.video.start_at);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
