<template>
  <div id="VideoGrid">
    <div class="py-2">
      <masonry :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }" :gutter="16">
        <PreviewCard
          v-for="(video, n) in videos"
          :key="video + n"
          :video="video"
          class="mb-4"
        />
      </masonry>
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
