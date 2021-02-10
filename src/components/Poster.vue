<template>
  <v-hover class="pointer">
    <template v-slot:default="{ hover }">
      <v-img
        @click.stop="openVideo(videoID)"
        v-ripple="{ class: 'neutral--text', center: true }"
        :src="source"
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
        <v-fade-transition>
          <v-overlay v-if="hover" absolute>
            <!-- Decide which one we like better -->
            <v-btn text> Play Video </v-btn>
            <!-- <v-btn :ripple="false" icon x-large id="no-background-hover">
              <v-icon x-large> mdi-play </v-icon>
            </v-btn> -->
          </v-overlay>
        </v-fade-transition>
      </v-img>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: "Poster",
  props: ["videoID", "source"],
  methods: {
    openVideo(videoID) {
      const current = this.$router.history.current;

      // Define cases in which to change route
      // to prevent router navigation duplication warnings

      // If on Play page and Video is already loaded (should not happen)
      if (current.name === "Player" && current.query.id == videoID) {
        return;
      }
      // If _not_ on Play page, e.g. when on Recordings page
      else if (current.name !== "Player") {
        // Open Video Player and ID
        this.$router.push({ name: "Player", query: { id: videoID } });
      }
      // If on Play page, but different Video is loaded
      else if (current.name === "Player" && current.query.id != videoID) {
        // Open ID
        this.$router.push({ query: { id: videoID } });
      }
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