<template>
  <div>
    <!-- Show Tags -->
    <div class="px-4" v-if="tagsPosition === 'top'">
      <Speakers :speakers="video.speakers" />
      <Tags :tags="video.tags" :length="video.length" />
    </div>
    <v-card-text>
      {{ video.desc }}
    </v-card-text>
    <div class="px-4" v-if="tagsPosition === 'bottom'">
      <Speakers :speakers="video.speakers" />
      <Tags :tags="video.tags" :length="video.length" />
    </div>
  </div>
</template>

<script>
import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";

export default {
  name: "VideoDescription",
  components: { Tags, Speakers },
  props: ["tagsPosition", "video", "dense"],
};
</script>