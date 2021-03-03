<template>
  <div id="VideoGrid">
    <div class="py-2">
      <v-row class="mx-n1">
        <v-col v-for="(video, n) in videos" cols="12" md="6" :key="video + n">
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <Poster :source="video.poster" :videoID="video.id" />
            </v-responsive>
            <VideoTitle :video="video" class="pt-4" />
            <VideoSubtitle :video="video" class="pb-2" />

            <VideoDescription :video="video" :tagsPosition="tagsPosition" />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";
import VideoSubtitle from "@/components/VideoSubtitle.vue";

export default {
  name: "VideoGrid",
  components: { Poster, VideoDescription, VideoTitle, VideoSubtitle },
  props: ["videos"],
  data: () => ({
    selected: [],
    tagsPosition: "top",
  }),
};
</script>