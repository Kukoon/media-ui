<template>
  <div>
    <!-- Show Tags -->
    <div class="px-4" v-if="tagsPosition === 'top'">
      <Speakers :speakers="video.speakers" />
      <Tags :tags="video.tags" :duration="readableDuration" />
    </div>
    <v-card-text v-if="markedDesc">
      <td v-html="markedDesc"></td>
    </v-card-text>
    <div class="px-4" v-if="tagsPosition === 'bottom'">
      <Speakers :speakers="video.speakers" />
      <Tags :tags="video.tags" :duration="readableDuration" />
    </div>
  </div>
</template>

<script>
import marked from "marked";
import prettyMilliseconds from "pretty-ms";

import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";

export default {
  name: "VideoDescription",
  components: { Tags, Speakers },
  props: ["tagsPosition", "video", "dense"],
  computed: {
    markedDesc() {
      return marked(this.video.description.description);
    },
    readableDuration() {
      return prettyMilliseconds(this.video.duration, { colonNotation: true });
    },
  },
};
</script>