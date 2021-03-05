<template>
  <router-link
    :to="'/play?id=' + video.id"
    class="title-link pointer"
    :title="video.lang.title"
    @click.stop="goToTop()"
  >
    <v-hover>
      <template v-slot:default="{ hover }">
        <div
          style="height: 100%"
          id="switcherWrapper"
          @mouseenter="showVideo = true"
          @mouseleave="showVideo = false"
        >
          <!-- <v-img
            v-if="!showVideo"
            v-ripple="{ class: 'neutral--text', center: true }"
            :src="hover ? preview : source"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
            height="100%"
            width="100%"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img> -->
          <div class="video pa-0 ma-0">
            <video
              loop
              :poster="source"
              disablePictureInPicture
              :muted="hover"
              preload="none"
              :src="showVideo ? previewSrc.formats[0].url : source"
              :key="video.id"
              height="100%"
              width="100%"
              @mouseenter="playVideo"
            ></video>
          </div>
        </div>
      </template>
    </v-hover>
  </router-link>
</template>

<script>
import axios from "axios";
import { config } from "../../config.js";

export default {
  name: "Poster",
  props: ["source", "preview", "video"],
  data() {
    return {
      showVideo: false,
      previewSrc: null,
    };
  },
  methods: {
    openVideo(video) {
      this.$store.dispatch("openVideo", video.id);
      this.$vuetify.goTo(0);
    },
    goToTop() {
      this.$nextTick(() => {
        this.$vuetify.goTo(0);
      });
    },
    playVideo(e) {
      e.target.play();
    },
    loadPreview(video) {
      const apiURL = config.apiURL + "recording/" + video.id + "?lang=de";
      axios.get(apiURL).then((response) => (this.previewSrc = response.data));
    },
  },
  created() {
    this.loadPreview(this.video);
  },
};
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
.pointer {
  cursor: pointer;
}
</style>