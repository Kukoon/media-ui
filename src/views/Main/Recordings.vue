<template>
  <v-container fluid id="Recordings">
    <v-row no-gutters class="d-flex align-center">
      <v-col class="pl-2">
        <v-tabs
          :color="darkMode ? 'accent lighten-3' : 'accent'"
          :background-color="darkMode ? '#121212' : null"
        >
          <v-tabs-slider
            :color="darkMode ? 'accent lighten-3' : 'accent'"
          ></v-tabs-slider>
          <v-tab v-for="(channel, id) in channels" :key="channel + id">
            {{ channel.title }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col>
        <v-card
          tile
          flat
          class="d-flex"
          :color="darkMode ? '#121212' : null"
          :class="
            $vuetify.breakpoint.xsOnly ? 'justify-end pr-1' : 'justify-center'
          "
        >
          <v-btn
            tile
            depressed
            small
            class="align-self-center mx-1"
            :color="darkMode ? 'neutral lighten-3' : 'neutral lighten-1'"
            :href="audioPodcastSrc"
            target="_blank"
          >
            <v-icon left>mdi-rss</v-icon>
            Audio
          </v-btn>
          <v-btn
            tile
            depressed
            small
            class="align-self-center mx-1"
            :color="darkMode ? 'neutral lighten-3' : 'neutral lighten-1'"
            :href="videoPodcastSrc"
            target="_blank"
          >
            <v-icon left>mdi-rss</v-icon>
            Video
          </v-btn>
        </v-card>
      </v-col>
      <v-col class="d-none d-sm-flex justify-end">
        <v-btn-toggle
          mandatory
          dense
          class="ma-1 align-self-center"
          borderless
          tile
          group
          :color="darkMode ? 'accent lighten-3' : 'accent'"
        >
          <v-btn to="../recordings" exact>
            <span>List</span>
            <v-icon right class="pr-2">mdi-view-list</v-icon>
          </v-btn>
          <v-btn to="../recordings/grid" exact>
            <span>Grid</span>
            <v-icon right small class="pr-2">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <router-view :videos="recordings"></router-view>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Recordings",
  data() {
    return {
      audioPodcastSrc: "https://media.kukoon.de/rss/kukoon/de/audio_best",
      videoPodcastSrc: "https://media.kukoon.de/rss/kukoon/de/video_best",
    };
  },
  computed: {
    ...mapGetters(["darkMode", "recordings"]),
    // Returns an array of unique channels
    channels() {
      const channels = Array.from(
        new Set(this.recordings.map((el) => el.channel.id))
      )
        .map((id) => {
          return this.recordings.find((el) => el.channel.id === id);
        })
        .map((el) => el.channel);
      return channels;
    },
  },
  methods: {
    openPodcast() {},
  },
  created() {
    this.$store.dispatch("loadRecordings");
  },
};
</script>