<template>
  <router-link
    :to="linkTo"
    :class="noLink ? '' : 'title-link pointer'"
    :title="
      video.lang
        ? video.lang.title
        : video.common_name
          ? video.common_name
          : video.id
    "
    @click.stop="goToTop()"
  >
    <div
      v-if="video.preview"
      @mouseenter="showPreview = true"
      @mouseleave="showPreview = false"
    >
      <v-img
        v-if="showPreview"
        v-ripple="{ class: 'neutral--text', center: true }"
        :src="video.preview"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
        height="100%"
        width="100%"
        style="position: absolute"
      >
        <template #placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            />
          </v-row>
        </template>
      </v-img>

      <transition
        name="fade"
        appear
      >
        <v-img
          v-if="!showPreview"
          v-ripple="{ class: 'neutral--text', center: true }"
          :src="video.poster"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
          height="100%"
          width="100%"
          style="position: absolute"
        >
          <template #placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              />
            </v-row>
          </template>
        </v-img>
      </transition>
    </div>
    <v-img
      v-else
      v-ripple="{ class: 'neutral--text', center: true }"
      :src="video.poster"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
      height="100%"
      width="100%"
      style="position: absolute"
    >
      <template #placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          />
        </v-row>
      </template>
    </v-img>
  </router-link>
</template>

<script>
export default {
  name: "Poster",
  props: {
    video: Object,
    noLink: Boolean,
    isStream: Boolean,
  },
  data() {
    return {
      showPreview: false,
    };
  },
  computed: {
    linkTo() {
      if (this.noLink) {
        return "";
      }
      if (this.isStream) {
        return { name: "Live", params: { id: this.video.channel.id } };
      }
      return { name: "Player", params: { id: this.video.id } };
    },
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
