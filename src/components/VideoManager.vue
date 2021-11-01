<template>
  <v-expansion-panels accordion>
    <v-expansion-panel v-for="video in recordings" :key="video.id">
      <v-expansion-panel-header>
        <span class="text-truncate">
          {{ video.lang ? video.lang.title : video.id }}
        </span>
        <v-chip
          v-if="video.listed"
          small
          color="teal"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
          label
          outlined
        >
          Listed
        </v-chip>
        <v-chip
          v-if="video.public"
          small
          color="deep-purple lighten-2"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
          label
          outlined
        >
          Public
        </v-chip>
        <v-chip
          v-else
          small
          color="orange"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
          label
          outlined
        >
          Private
        </v-chip>
        <v-chip
          small
          label
          outlined
          class="flex-grow-0 flex-shrink-0 monospace pr-3 mr-4"
        >
          {{ videoDate(video.created_at) }}
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card tile elevation="0">
          <v-card-text class="pa-0 d-flex flex-column justify-end">
            <v-row no-gutters dense>
              <v-switch
                v-model="video.public"
                class="pt-0 mt-0 mr-4"
                hide-details
                label="Public"
                color="primary lighten-3"
              />
              <v-switch
                v-model="video.listed"
                class="pt-0 mt-0"
                hide-details
                label="Listed"
                color="primary lighten-3"
              />
            </v-row>
          </v-card-text>
          <v-card-actions class="px-0 pt-4 mt-4">
            <v-btn outlined color="success" @click="save(video)">
              <v-icon left> mdi-content-save </v-icon> Save
            </v-btn>
            <v-btn
              outlined
              class="ml-auto"
              color="blue"
              :to="{ name: 'Player', params: { id: video.id } }"
              target="_blank"
            >
              <v-icon left> mdi-web </v-icon> View
            </v-btn>
            <v-btn
              color="success darken-1"
              :to="{
                name: 'RecordingEdit',
                params: { channelid: video.channel.id, recordingid: video.id },
              }"
            >
              <v-icon left> mdi-pencil </v-icon> Edit
            </v-btn>
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
      dateOptions: {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    channelid() {
      this.load();
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    save(video) {
      api.Recordings.Save(video.id, models.Recording.ToRequest(video)).then(
        this.load
      );
    },
    load() {
      api.Recordings.ListChannelMy(this.channelid).then(
        (response) => (this.recordings = response.data)
      );
    },
    videoDate(dateString) {
      return new Date(dateString).toLocaleDateString(
        undefined,
        this.dateOptions
      );
    },
  },
};
</script>

<style scoped>
.monospace {
  font-family: monospace;
}
</style>
