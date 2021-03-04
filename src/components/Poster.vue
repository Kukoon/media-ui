<template>
  <router-link
    :to="'/play?id=' + video.id"
    class="title-link"
    :title="video.lang.title"
    @click.stop="goToTop()"
  >
    <v-hover class="pointer">
      <template v-slot:default="{ hover }">
        <v-img
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
        </v-img>
      </template>
    </v-hover>
  </router-link>
</template>

<script>
export default {
  name: "Poster",
  props: ["source", "preview", "video"],
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
</style>