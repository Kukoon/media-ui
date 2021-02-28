<template>
  <div id="VideoList">
    <div class="pa-2" v-for="(video, n) in videos" :key="video + n">
      <v-row dense>
        <v-col cols="12" sm="4">
          <VideoTitle :video="video" class="d-flex d-sm-none" />

          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <Poster
                :source="video.poster"
                :videoID="video.id"
                :isLive="video.running"
              />
            </v-responsive>
          </v-card>
          <Speakers
            v-if="video.speakers"
            :speakers="video.speakers"
            class="mt-2"
          />
          <Tags
            v-if="video.tags || video.duration"
            :tags="video.tags"
            :duration="video.duration"
            class="mt-2"
          />
        </v-col>
        <v-col
          cols="12"
          sm="8"
          :class="$vuetify.breakpoint.xsOnly ? 'px-0' : 'px-3'"
        >
          <VideoTitle :video="video" class="d-none d-sm-flex" />
          <VideoDescription :video="video" />
        </v-col>
      </v-row>
      <v-divider
        v-if="n < videos.length - 1"
        class="mb-2 mt-4 mx-16"
      ></v-divider>
    </div>
  </div>
</template>

<script>
import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";

import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";

export default {
  name: "VideoList",
  components: { Poster, VideoDescription, VideoTitle, Tags, Speakers },
  props: ["videos"],
  data: () => ({
    selected: [],
  }),
};
</script>
