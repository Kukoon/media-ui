<template>
  <div id="VideoList">
    <div class="pa-2" v-for="(video, n) in videos" :key="video + n">
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-card
            tile
            elevation="0"
            :style="darkMode ? 'background-color: #121212' : null"
            :outlined="$vuetify.breakpoint.xsOnly"
          >
            <v-responsive :aspect-ratio="16 / 9">
              <Poster
                :source="video.poster"
                :preview="video.preview"
                :videoID="video.id"
                :isRunning="video.running"
              />
            </v-responsive>
            <VideoTitle
              :video="video"
              class="d-flex d-sm-none"
              :class="$vuetify.breakpoint.xsOnly ? 'pt-4' : null"
            />
            <VideoSubtitle :video="video" class="d-flex d-sm-none" />
            <Speakers
              v-if="video.speakers"
              :speakers="video.speakers"
              class="mt-2"
              :class="$vuetify.breakpoint.xsOnly ? 'px-4' : null"
            />
            <Tags
              v-if="video.tags || video.duration"
              :tags="video.tags"
              :duration="video.duration"
              :class="$vuetify.breakpoint.xsOnly ? 'px-4' : 'pb-4'"
            />
            <VideoDescription :video="video" class="d-flex d-sm-none px-4" />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="8"
          v-if="!$vuetify.breakpoint.xsOnly"
          :class="$vuetify.breakpoint.xsOnly ? 'px-0' : 'px-3'"
        >
          <v-card tile elevation="0" class="px-0 pt-4" outlined>
            <VideoTitle :video="video" class="d-none d-sm-flex" />
            <VideoSubtitle :video="video" class="d-none d-sm-flex" />
            <VideoDescription :video="video" class="d-none d-sm-flex px-4" />
          </v-card>
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
