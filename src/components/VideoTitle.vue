<template>
  <router-link
    :to="linkTo"
    class="title-link px-0 dense-text"
    :title="video.lang ? video.lang.title : video.common_name ? video.common_name : video.id"
    :tag="noLink? 'span' : 'a'"
  >
    <v-card-title
      class="pt-0 pb-1 dense-text text-truncate"
      :class="dense ? 'pt-2' : 'pt-0'"
    >
      {{ video.lang ? video.lang.title : video.common_name ? video.common_name : video.id }}
    </v-card-title>
  </router-link>
</template>

<script>
export default {
  name: "VideoTitle",
  props: {
    "video": Object,
    "dense": Boolean,
    "noLink": Boolean,
    "isStream": Boolean,
  },
  computed: {
    linkTo() {
        if (this.noLink) {
          return '';
        }
        if (this.isStream) {
          return { name: 'Live', params: { id: this.video.channel.id}};
        }
        return { name: 'Player',  params: { id: this.video.id} };
    },
  },
};
</script>

<style scoped>
.dense-text {
  font-size: 1rem !important;
  text-overflow: ellipsis !important;
  display: block !important;
  word-break: normal;
}

.title-link {
  text-decoration: none;
  color: var(--v-theme-text-base);
  display: inline-block;
}
</style>
