<template>
  <div>
    <v-card-title
      class="pt-0"
      :class="[
        video.subtitle !== undefined ? 'pb-4' : 'pb-1',
        // add classes if dense
        dense === true ? 'dense-text text-truncate pt-2' : null,
      ]"
    >
      {{ video.name }}
    </v-card-title>
    <v-card-subtitle
      v-if="video.subtitle !== undefined"
      class="pb-4"
      :class="[dense === true ? 'text-truncate' : null]"
    >
      {{ video.subtitle }}
    </v-card-subtitle>
    <!-- Show Tags -->
    <div class="px-4" v-if="tagsPosition === 'top'">
      <Speakers :speakers="video.speakers" v-if="dense !== true" />
      <Tags :tags="video.tags" :length="video.length" />
    </div>
    <v-card-text v-if="dense !== true">
      {{ video.short }}
    </v-card-text>
    <div class="px-4" v-if="tagsPosition === 'bottom'">
      <Speakers :speakers="video.speakers" v-if="dense !== true" />
      <Tags :tags="video.tags" :length="video.length" />
    </div>
  </div>
</template>

<script>
import Tags from "./Tags.vue";
import Speakers from "./Speakers.vue";

export default {
  name: "VideoText",
  components: { Tags, Speakers },
  props: ["tagsPosition", "video", "dense"],
};
</script>

<style scoped>
.dense-text {
  overflow: hidden;
  font-size: 1rem !important;
  text-overflow: ellipsis !important;
}
</style>