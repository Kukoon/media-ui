<template>
  <v-card outlined tile elevation="0" width="100%">
    <v-responsive :aspect-ratio="16 / 9">
      <v-card-subtitle
        class="px-2 py-2 ml-auto"
        style="position: absolute; z-index: 2; bottom: 0; right: 0"
      >
        <v-chip
          small
          label
          class="grey darken-4 px-2"
          v-if="readableDuration || video.start_at"
        >
          {{
            video.start_at
              ? readableDate + " @ " + readableTime
              : readableDuration
          }}
        </v-chip>
      </v-card-subtitle>
      <Poster :video="video" :no-link="noLink" :is-stream="isStream" />
    </v-responsive>
    <VideoTitle
      :video="video"
      :no-link="noLink"
      :is-stream="isStream"
      :dense="dense"
    />
    <VideoSubtitle :video="video" :dense="dense" />
    <v-expansion-panels v-if="video.lang" flat tile>
      <v-expansion-panel>
        <v-expansion-panel-header
          class="pl-2 pr-4 py-2 d-flex"
          @click="toggleDescription(video.id)"
        >
          <v-btn
            tile
            color="accent lighten-2"
            class="px-1 flex-grow-0"
            text
            :ripple="false"
          >
            {{ show.includes(video.id) ? "Less" : "More" }}
          </v-btn>
          <v-spacer />
        </v-expansion-panel-header>
        <v-expansion-panel-content id="paddingFix">
          <v-divider />
          <VideoDescription
            :video="video"
            :tags-position="tagsPosition"
            class="pt-3 px-4"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <slot />
  </v-card>
</template>

<script>
import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";
import VideoTitle from "@/components/VideoTitle.vue";
import VideoSubtitle from "@/components/VideoSubtitle.vue";
import prettyMilliseconds from "pretty-ms";

export default {
  name: "PreviewCard",
  components: {
    Poster,
    VideoDescription,
    VideoTitle,
    VideoSubtitle,
  },
  props: ["video", "noLink", "isStream", "width"],
  data() {
    return {
      tagsPosition: "top",
      show: [],
      dense: true,
    };
  },
  computed: {
    readableDate() {
      const date = new Date(this.video.start_at);
      var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString([], options);
    },
    readableTime() {
      const date = new Date(this.video.start_at);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    readableDuration() {
      if (this.video.duration) {
        return prettyMilliseconds(this.video.duration / 1000000, {
          colonNotation: true,
        });
      } else {
        return null;
      }
    },
  },
  methods: {
    toggleDescription(id) {
      // If show array does not include video id, add it to show array
      if (!this.show.includes(id)) {
        this.show.push(id);
      }
      // Else remove element at the index of the video id in the show array
      else {
        const index = this.show.indexOf(id);
        if (index > -1) {
          this.show.splice(index, 1);
        }
      }
    },
  },
};
</script>


<style scoped>
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 0 !important;
}

/* see: https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors */
.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
