<template>
  <div id="VideoList">
    <div v-for="(video, n) in videos" :key="video + n" class="pa-2 pb-6">
      <v-row dense>
        <v-card
          tile
          elevation="0"
          height="100%"
          width="100%"
          class="d-flex"
          :class="[
            darkMode ? 'outline-dark' : 'outline-light',
            $vuetify.breakpoint.smAndDown ? ' flex-column' : none,
          ]"
        >
          <div class="d-none d-md-inline-block pa-4">
            <v-responsive :aspect-ratio="16 / 9" max-height="200" width="356">
              <Poster :video="video" :no-link="noLink" :is-stream="isStream" />
            </v-responsive>
          </div>
          <v-responsive :aspect-ratio="16 / 9" class="d-flex d-md-none">
            <Poster :video="video" :no-link="noLink" :is-stream="isStream" />
          </v-responsive>
          <div class="d-inline-block">
            <VideoTitle
              :video="video"
              :no-link="noLink"
              :is-stream="isStream"
              class="mt-2"
            />
            <VideoSubtitle :video="video" />
            <Speakers
              v-if="video.speakers"
              :speakers="video.speakers"
              class="px-4 mt-2"
            />
            <Tags
              v-if="video.tags || video.duration"
              :tags="video.tags"
              :event="video.event"
              :duration="video.duration"
              :running="video.running"
              :viewers="video.viewers"
              class="px-4"
            />
            <VideoDescription :video="video" class="px-4" />
          </div>
        </v-card>
        <!-- <v-col
          v-if="!$vuetify.breakpoint.xsOnly"
          cols="12"
          sm="6"
          md="8"
          class="pl-0"
        >
          <v-card
            tile
            elevation="0"
            class="px-0 pt-4"
            :class="darkMode ? 'outline-dark' : 'outline-light'"
            height="100%"
            style="border-left: none"
          >
            <VideoTitle
              :video="video"
              :no-link="noLink"
              :is-stream="isStream"
              class="d-none d-sm-flex ml-n1"
            />
            <VideoSubtitle :video="video" class="d-none d-sm-flex ml-n1" />
            <VideoDescription
              :video="video"
              class="d-none d-sm-flex px-4 ml-n1"
            />
          </v-card>
        </v-col> -->
      </v-row>
    </div>
  </div>
</template>

<script>
import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";
import VideoSubtitle from "@/components/VideoSubtitle.vue";

import Tags from "@/components/Tags.vue";
import Speakers from "@/components/Speakers.vue";
import { mapGetters } from "vuex";

export default {
  name: "VideoList",
  components: {
    Poster,
    VideoDescription,
    VideoTitle,
    VideoSubtitle,
    Tags,
    Speakers,
  },
  props: ["videos", "noLink", "isStream"],
  data: () => ({
    selected: [],
  }),
  computed: {
    ...mapGetters(["darkMode"]),
  },
};
</script>

<style scoped>
.outline-dark {
  border: thin solid;
  border-color: rgba(255, 255, 255, 0.12);
}
.outline-light {
  border: thin solid;
  border-color: rgba(0, 0, 0, 0.12);
}
</style>
