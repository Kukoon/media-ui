<template>
  <router-link
    :to="'/play?id=' + video.id"
    class="title-link pointer"
    :title="video.lang.title"
    @click.stop="goToTop()"
  >
    <div
      style="height: 100%; position: relative"
      id="switcherWrapper"
      @mouseenter="showPreview = true"
      @mouseleave="showPreview = false"
    >
      <v-img
        v-ripple="{ class: 'neutral--text', center: true }"
        :src="preview"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
        height="100%"
        width="100%"
        style="position: absolute"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <transition name="fade" appear>
        <v-img
          v-if="!showPreview"
          v-ripple="{ class: 'neutral--text', center: true }"
          :src="source"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
          height="100%"
          width="100%"
          style="position: absolute"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </transition>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Poster",
  props: ["source", "preview", "video"],
  data() {
    return {
      showPreview: false,
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>