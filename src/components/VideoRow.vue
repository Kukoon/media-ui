<template>
  <div id="VideoRow">
    <div class="py-2">
      <h1 class="px-2 mb-2 headline d-flex">
        {{ title }}
        <router-link
          v-if="!noLink"
          :to="{
            path: 'recordings/grid/',
            params: {
              title: title,
            },
            query: params,
          }"
        >
          <v-btn icon class="ml-2 mt-n1" color="primary"
            ><v-icon>mdi-chevron-double-right</v-icon></v-btn
          >
        </router-link>
        <v-spacer></v-spacer>
        <v-btn
          class="ml-auto"
          icon
          color="primary"
          @click="prevVideo"
          :disabled="counter === 0"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          icon
          color="primary"
          @click="nextVideo"
          :disabled="
            counter == filterVideo.length - this.columns ||
            filterVideo.length < this.columns
          "
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </h1>
      <masonry
        ref="masonry"
        :cols="{ default: 4, 1264: 3, 960: 2, 600: 1 }"
        :gutter="16"
      >
        <PreviewCard
          v-for="(video, n) in displayedVideos"
          :key="video + n"
          :video="video"
          :noLink="noLink"
          class="mb-4"
        />
      </masonry>
    </div>
  </div>
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";

import { api } from "@/services/api.js";

export default {
  name: "VideoRow",
  components: {
    PreviewCard,
  },
  props: ["title", "videos", "params", "noLink"],
  data() {
    return {
      isMounted: false,
      counter: 0,
      filterVideo: [],
    };
  },
  computed: {
    columns() {
      if (!this.isMounted) return;
      else {
        return this.$refs.masonry.displayColumns;
      }
    },
    displayedVideos() {
      return this.filterVideo.slice(this.counter, this.columns + this.counter);
    },
  },
  methods: {
    load() {
      let prom = api.Recordings.List(this.params);
      // handle multiple parameters / or
      if (Array.isArray(this.params)) {
        prom = api.Or(api.Recordings.List, this.params)
      }
      // filter duplicate - maybe just a try (better with id)
      prom.then((resp)=>this.filterVideo = resp.data.filter(function(item, pos) {
        return resp.data.indexOf(item) == pos;
      }));
    },
    nextVideo() {
      this.counter++;
    },
    prevVideo() {
      this.counter--;
    },
  },
  mounted() {
    this.isMounted = true;
    if (!this.params) {
      this.filterVideo = this.videos;
    } else {
      this.load();
    }
  },
};
</script>
