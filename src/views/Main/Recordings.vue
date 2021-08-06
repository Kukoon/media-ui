<template>
  <v-container fluid id="Recordings">
    <v-row no-gutters class="d-flex align-center mx-2 mb-3">
      <v-col class="justify-start">
        <v-card tile flat class="d-flex" :color="darkMode ? '#121212' : null">
          <v-btn
            tile
            depressed
            small
            class="align-self-center mr-1"
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
            class="align-self-center ml-1"
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
          :color="darkMode ? 'accent lighten-3' : 'accent'"
          tile
          class="my-1"
          borderless
          dense
          group
          v-model="showFilterGroup"
        >
          <v-btn>
            <span>Filter</span>
            <v-icon right class="pr-2">mdi-filter-variant</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-btn-toggle
          mandatory
          dense
          class="my-1 mr-n1 align-self-center"
          borderless
          tile
          group
          :color="darkMode ? 'accent lighten-3' : 'accent'"
        >
          <v-btn
            :to="{ name: 'VideoList', query: $router.history.current.query }"
            exact-path
          >
            <span>List</span>
            <v-icon right class="pr-2">mdi-view-list</v-icon>
          </v-btn>
          <v-btn
            :to="{ name: 'VideoGrid', query: $router.history.current.query }"
            exact-path
          >
            <span>Grid</span>
            <v-icon right small class="pr-2">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row no-gutters class="d-flex align-center mx-2 pb-2" v-if="showFilter">
      <v-col cols="4">
        <v-autocomplete
          class="mr-2 pt-1"
          label="Events"
          :items="events"
          item-text="name"
          item-value="id"
          v-model="eventsFilter"
          small-chips
          clearable
          filled
          dense
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          class="mx-2 pt-1"
          label="Tags"
          :items="tags"
          item-text="lang.name"
          item-value="id"
          v-model="tagsFilter"
          small-chips
          deletable-chips
          multiple
          filled
          dense
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          class="ml-2 pt-1"
          label="Speakers"
          :items="speakers"
          item-text="name"
          item-value="id"
          v-model="speakersFilter"
          small-chips
          deletable-chips
          multiple
          filled
          dense
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <router-view :videos="recordings"></router-view>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { api } from "@/services/api.js";

export default {
  name: "Recordings",
  data() {
    return {
      audioPodcastSrc: "https://media.kukoon.de/rss/kukoon/de/audio_best",
      videoPodcastSrc: "https://media.kukoon.de/rss/kukoon/de/video_best",
      recordings: [],
      tags: [],
      speakers: [],
      events: [],
      showFilter: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
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
    showFilterGroup: {
      get() { return this.showFilter ? 0 : undefined; },
      set(v) { this.showFilter = v == 0 ? true : false },
    },
    tagsFilter: {
      cache: false,
      get() {
        return this.filterGet("tag", true);
      },
      set(newValue) {
        this.filterSet("tag", newValue);
      },
    },
    speakersFilter: {
      cache: false,
      get() {
        return this.filterGet("speaker", true);
      },
      set(newValue) {
        this.filterSet("speaker", newValue);
      },
    },
    eventsFilter: {
      cache: false,
      get() {
        return this.filterGet("event", false);
      },
      set(newValue) {
        this.filterSet("event", newValue);
      },
    },
  },
  methods: {
    filterGet(key, needArray) {
      if (this.$router.history.current.query[key]) {
        const v = this.$router.history.current.query[key];
        if (!Array.isArray(v) && needArray) {
          return [v];
        }
        return v;
      }
      return [];
    },
    filterSet(key, value) {
      var query = Object.assign({}, this.$router.history.current.query);
      if (value) {
        query[key] = value;
      } else {
        delete query[key];
      }
      console.log("from", this.$router.history.current, "to", query);
      this.$router.push({
        name: this.$router.history.current.name,
        query: query,
      });
    },
    loadFilterData() {
      api.ListTags().then((response) => (this.tags = response.data));
      api.ListEvents().then((response) => (this.events = response.data));
      api.ListSpeakers().then((response) => (this.speakers = response.data));
    },
    load() {
      api
        .ListRecordings(this.$router.history.current.query)
        .then((response) => (this.recordings = response.data));
    },
    openPodcast() {},
  },
  watch: {
    $route(to) {
      this.load();
      this.showFilter =
        Object.keys(to.query).length !== 0;
    },
  },
  created() {
    this.loadFilterData();
    this.load();
    this.showFilter =
      Object.keys(this.$router.history.current.query).length !== 0;
  },
};
</script>
