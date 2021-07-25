<template>
  <div>
    <!-- Show Tags -->
    <div v-if="tagsPosition === 'top'">
      <Speakers :speakers="video.speakers" />
      <Tags
        :tags="video.tags"
        :event="video.event"
        :duration="video.duration"
        :running="video.running"
        :viewers="video.viewers"
      />
    </div>
    <v-card-text class="px-0" v-if="markedDesc">
      <td v-html="markedDesc"></td>
    </v-card-text>
    <div v-if="tagsPosition === 'bottom'">
      <Speakers :speakers="video.speakers" />
      <Tags
        :tags="video.tags"
        :event="video.event"
        :duration="video.duration"
        :running="video.running"
        :viewers="video.viewers"
      />
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
  props: ["tagsPosition", "video", "dense", "long"],
  computed: {
    markedDesc() {
      if (this.video.lang) {
        if (this.long) {
          return marked(this.video.lang.long);
        }
        return marked(this.video.lang.short);
      }
      return null;
    },
  },
};
</script>
