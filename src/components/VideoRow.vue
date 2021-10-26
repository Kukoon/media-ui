<template>
  <div id="VideoRow">
    <div class="py-2">
      <h1 class="px-2 mb-2 headline d-flex" to="{ path: 'recordings/grid/' }">
        {{ title }}
        <router-link
          v-if="eventID && !tagID"
          :to="{
            path: 'recordings/grid/',
            params: {
              title: title,
            },
            query: {
              event: eventID,
            },
          }"
        >
          <v-btn icon class="ml-2 mt-n1" color="primary"
            ><v-icon>mdi-chevron-double-right</v-icon></v-btn
          >
        </router-link>
        <router-link
          v-else-if="!eventID && tagID"
          :to="{
            path: 'recordings/grid/',
            params: {
              title: title,
            },
            query: {
              tag: tagID,
            },
          }"
        >
          <v-btn icon class="ml-2 mt-n1" color="primary"
            ><v-icon>mdi-chevron-double-right</v-icon></v-btn
          >
        </router-link>
        <router-link
          v-else
          :to="{
            path: 'recordings/grid/',
            params: {
              title: title,
            },
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
          :disabled="counter == filterVideos.length - this.columns"
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
          class="mb-4"
        />
      </masonry>
    </div>
  </div>
</template>

<script>
import PreviewCard from "@/components/PreviewCard.vue";

export default {
  name: "VideoRow",
  components: {
    PreviewCard,
  },
  props: ["videos", "title", "eventID", "tagID"],
  data() {
    return {
      isMounted: false,
      counter: 0,
    };
  },
  computed: {
    columns() {
      if (!this.isMounted) return;
      else {
        return this.$refs.masonry.displayColumns;
      }
    },
    filterVideos() {
      if (this.eventID) {
        return this.videos
          .filter((r) => r.event)
          .filter((r) => r.event.id === this.eventID);
      }
      if (this.tagID) {
        return this.videos.filter((r) =>
          r.tags.find((el) => el.id === this.tagID)
        );
      } else {
        return this.videos;
      }
    },
    displayedVideos() {
      return this.filterVideos.slice(this.counter, this.columns + this.counter);
    },
  },
  methods: {
    nextVideo() {
      console.log(this.videos);
      this.counter++;
    },
    prevVideo() {
      this.counter--;
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>