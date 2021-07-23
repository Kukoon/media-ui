<template>
  <div id="VideoList">
    <div class="pa-2" v-for="(video, n) in videos" :key="video + n">
      <v-row dense>
        <v-col cols="12" sm="6" md="4" class="pl-1 pr-0">
          <v-card
            tile
            elevation="0"
            height="100%"
            :class="darkMode ? 'outline-dark' : 'outline-light'"
            :style="!$vuetify.breakpoint.xsOnly ? 'border-right: none;' : null"
          >
            <v-responsive
              :aspect-ratio="16 / 9"
              :class="!$vuetify.breakpoint.xsOnly ? 'pl-4 pt-4 pr-2' : null"
            >
              <Poster
                :video="video"
                :source="video.poster"
                :preview="video.preview"
                :title="video.lang.title"
                :running="video.running"
              />
            </v-responsive>
            <VideoTitle
              :video="video"
              v-if="$vuetify.breakpoint.xsOnly"
              :class="$vuetify.breakpoint.xsOnly ? 'pt-4' : null"
            />
            <VideoSubtitle :video="video" class="d-flex d-sm-none" />
            <Speakers
              v-if="video.speakers"
              :speakers="video.speakers"
              class="mt-2"
              :class="$vuetify.breakpoint.xsOnly ? 'px-4' : 'px-4'"
            />
            <Tags
              v-if="video.tags || video.duration"
              :tags="video.tags"
              :event="video.event"
              :duration="video.duration"
              :class="$vuetify.breakpoint.xsOnly ? 'px-4' : 'pb-4 px-4'"
            />
            <VideoDescription :video="video" class="d-flex d-sm-none px-4" />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="8"
          v-if="!$vuetify.breakpoint.xsOnly"
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
            <VideoTitle :video="video" class="d-none d-sm-flex ml-n1" />
            <VideoSubtitle :video="video" class="d-none d-sm-flex ml-n1" />
            <VideoDescription
              :video="video"
              class="d-none d-sm-flex px-4 ml-n1"
            />
          </v-card>
        </v-col>
      </v-row>
      <!-- <v-divider
        v-if="n < videos.length - 1"
        class="mb-2 mt-4 mx-16"
      ></v-divider> -->
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
  props: ["videos"],
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
