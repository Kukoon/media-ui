<template>
  <v-expansion-panels accordion tile class="mt-4">
    <v-expansion-panel v-for="video in recordings" :key="video.id">
      <v-expansion-panel-header>
        <span class="text-truncate">
          {{ video.lang.title }}
        </span>
        <v-chip
          v-if="video.listed"
          small
          color="green"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
          label
          outlined
          >Listed</v-chip
        >
        <v-chip
          v-if="video.public"
          small
          color="blue"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
          label
          outlined
          >Public</v-chip
        >
        <v-chip
          v-else
          small
          color="orange"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
          label
          outlined
          >Private</v-chip
        >
        <v-chip
          small
          label
          outlined
          class="flex-grow-0 flex-shrink-0 monospace pr-3 mr-4"
        >
          {{ video.created_at }}
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card tile elevation="0" class="pa-0 mt-2">
          <v-card-text class="pa-0 d-flex flex-column justify-end">
            <v-row no-gutters dense>
              <v-switch
                v-model="video.public"
                class="pt-4 pb-4 ma-0"
                hide-details
                label="Public"
                color="primary lighten-3"
              ></v-switch>
              <v-switch
                v-model="video.listed"
                class="pt-4 pb-4 ma-0"
                hide-details
                label="Listed"
                color="primary lighten-3"
              ></v-switch>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn outlined class="ml-auto" color="sucess" @click="save(video)"> Save </v-btn>
            <v-btn class="ml-auto" color="sucess darken-1" :to="{ name: 'RecordingEdit', params: { channelid: video.channel.id, recordingid: video.id} }"> Edit </v-btn>
            <v-btn outlined class="ml-auto" color="blue" :to="{ name: 'Player', params: { id: video.id} }" target="_blank"><v-icon left>mdi-web</v-icon> View </v-btn>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import { models } from "@/services/lib.js";

export default {
  name: "VideoManager",
  props: ["channelid"],
  data() {
    return {
      recordings: [],
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    save(video) {
      api.Recordings.Save(video.id, models.Recording.ToRequest(video)).then(this.load);
    },
    load() {
      api
        .Recordings.ListChannelMy(this.channelid)
        .then((response) => (this.recordings = response.data));
    },
  },
  watch: {
    channelid() {
      this.load()
    },
  },
  mounted() {
    this.load()
  },
};
</script>

<style scoped>
.monospace {
  font-family: monospace;
}
</style>
