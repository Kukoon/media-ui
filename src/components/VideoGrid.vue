<template>
  <div id="VideoGrid">
    <div class="py-2">
      <v-row class="mx-n1">
        <v-col
          v-for="(video, n) in videos"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          :key="video + n"
        >
          <PreviewCard :video="video" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";

export default {
  name: "VideoGrid",
  components: {
    PreviewCard,
  },
  props: ["videos"],
};
</script>
