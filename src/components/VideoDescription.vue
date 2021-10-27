<template>
  <div>
    <v-card-text class="px-0" v-if="markedDesc && tagsPosition !== 'top'">
      <td v-html="markedDesc"></td>
    </v-card-text>
    <div v-if="tagsPosition">
      <BTNVideoDownload
        v-if="video.formats"
        :sources="video.formats"
        class="mt-1"
      />
      <Metadata
        :duration="video.duration"
        :running="video.running"
        :viewers="video.viewers"
        :createdAt="video.created_at"
      ></Metadata>
      <Events :event="video.event"></Events>
      <Tags :tags="video.tags" />
      <Speakers :speakers="video.speakers" />
    </div>
    <v-card-text class="px-0" v-if="markedDesc && tagsPosition === 'top'">
      <td v-html="markedDesc"></td>
    </v-card-text>
  </div>
</template>

<script>
import marked from "marked";

import BTNVideoDownload from "@/components/BTNVideoDownload.vue";
import Events from "@/components/Events.vue";
import Metadata from "@/components/Metadata.vue";
import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";

export default {
  name: "VideoDescription",
  components: { BTNVideoDownload, Events, Metadata, Speakers, Tags },
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
