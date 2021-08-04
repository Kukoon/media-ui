<template>
  <v-container fluid id="Recordings">
    <v-row no-gutters class="d-flex align-center mx-2 mb-3">
      <v-col>
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
          :class="[
            $vuetify.breakpoint.xsOnly ? 'justify-end' : 'justify-center',
          ]"
        >
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
          mandatory
          dense
          class="my-1 mr-n1 align-self-center"
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
    <v-row no-gutters class="d-flex align-center mx-2 mb-3">
      <v-col cols="4">
        <v-autocomplete
          label="Events"
          :items="events"
          item-text="name"
          item-value="id"
          v-model="eventsFilter"
          dense
          chips
          small-chips
          clearable
         >
        </v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          label="Tags"
          :items="tags"
          item-text="lang.name"
          item-value="id"
          v-model="tagsFilter"
          dense
          chips
          small-chips
          deletable-chips
          multiple
         >
        </v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          label="Speakers"
          :items="speakers"
          item-text="name"
          item-value="id"
          v-model="speakersFilter"
          dense
          chips
          small-chips
          deletable-chips
          multiple
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
    tagsFilter: {
      cache: false,
      get() { return this.filterGet("tag")},
      set(newValue) { this.filterSet("tag", newValue)},
    },
    speakersFilter: {
      cache: false,
      get() { return this.filterGet("speaker")},
      set(newValue) { this.filterSet("speaker", newValue)},
    },
    eventsFilter: {
      cache: false,
      get() { return this.filterGet("event")},
      set(newValue) { this.filterSet("event", newValue)},
    },
  },
  methods: {
    filterGet(key) {
        return this.$router.history.current.query[key] ? this.$router.history.current.query[key] : [];
    },
    filterSet(key, value) {
	var query = Object.assign({}, this.$router.history.current.query);
        if (value) {
          query[key] = value;
        } else {
          delete query[key]
        }
        console.log("from", this.$router.history.current, "to", query);
        this.$router.push({
          name: this.$router.history.current.name,
          query: query,
        });
      
    },
    loadFilterData() {
      api.ListTags().then((response) => (this.tags = response.data))
      api.ListEvents().then((response) => (this.events = response.data))
      api.ListSpeakers().then((response) => (this.speakers = response.data))
    },
    load() {
      api.ListRecordings(this.$router.history.current.query).then((response) => (this.recordings = response.data))
    },
    openPodcast() {},
  },
  watch: {
    $route() {
      this.load();
      this.$forceCmpile('tagsFilter');
      this.$forceCmpile('speakersFilter');
      this.$forceCmpile('eventsFilter');
    },
  },
  created() {
    this.loadFilterData();
    this.load();
  },
};
</script>
