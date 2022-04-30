<template>
  <div>
    <v-card-text v-if="markedDesc && tagsPosition !== 'top'" class="px-0">
      <td v-html="markedDesc" />
    </v-card-text>
    <div v-if="tagsPosition">
      <BTNVideoDownload
        v-if="video.formats"
        :sources="video.formats"
        class="mt-1"
      />
      <Metadata
        v-if="showMeta !== false"
        :running="video.running"
        :viewers="video.viewers"
        :created-at="video.created_at"
      />
      <Events :event="video.event" />
      <Tags v-if="video.tags" :tags="video.tags" />
      <Speakers v-if="video.speakers" :speakers="video.speakers" />
    </div>
    <v-card-text v-if="markedDesc && tagsPosition === 'top'" class="px-0">
      <td v-html="markedDesc" />
    </v-card-text>
  </div>
</template>

<script>
import { marked } from "marked";

import BTNVideoDownload from "@/components/BTNVideoDownload.vue";
import Events from "@/components/Events.vue";
import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";
import Metadata from "@/components/Metadata";

export default {
  name: "VideoDescription",
  components: { BTNVideoDownload, Events, Speakers, Tags, Metadata },
  props: ["tagsPosition", "video", "long", "showMeta"],
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
