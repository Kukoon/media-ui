<template>
  <div>
    <!-- Show Tags -->
    <div class="px-4" v-if="tagsPosition === 'top'">
      <Speakers :speakers="video.speakers" />
      <Tags :tags="video.tags" :duration="video.duration" :running="video.running" />
    </div>
    <v-card-text v-if="markedDesc">
      <td v-html="markedDesc"></td>
    </v-card-text>
    <div class="px-4" v-if="tagsPosition === 'bottom'">
      <Speakers :speakers="video.speakers" />
      <Tags :tags="video.tags" :duration="video.duration" :running="video.running" />
    </div>
  </div>
</template>

<script>
import marked from "marked";

import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";

export default {
  name: "VideoDescription",
  components: { Tags, Speakers },
  props: ["tagsPosition", "video", "dense"],
  computed: {
    markedDesc() {
      if (this.video.lang) {
        return marked(this.video.lang.short);
      } else {
        return null;
      }
    },
  },
};
</script>
