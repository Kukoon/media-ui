<template>
  <v-container fluid>
    <div class="mx-n5 my-n3">
      <v-row class="ma-1" v-for="(recording, n) in recordings" :key="n">
        <v-col>
          <v-card
            aspect-ratio="1,7"
            width="600px"
            color="grey darken-4"
            outlined
            tile
            elevation="0"
            @click="log(recording)"
          >
            <v-img
              :src="recording.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
              height="100%"
              width="100%"
            >
            </v-img>
          </v-card>
        </v-col>
        <v-col>
          <v-card-title class="mx-n3">
            {{ recording.name }}
          </v-card-title>
          <v-card-subtitle class="mx-n3">
            {{ recording.subtitle }}
          </v-card-subtitle>
          <v-chip
            v-for="(tag, n) in recording.tags"
            :key="n"
            small
            class="ma-1"
            color="tertiary"
            label
          >
            <v-icon small left> mdi-label </v-icon>
            {{ tag }}
          </v-chip>
          <v-chip
            v-for="(speaker, n) in recording.speakers"
            :key="n"
            small
            class="ma-1"
            color="secondary"
            label
          >
            <v-icon small left> mdi-account-circle-outline </v-icon>
            {{ speaker }}
          </v-chip>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import recordings from "../data/recordings.json";

export default {
  name: "RecordingsList",
  data: () => ({
    selected: [],
    recordings: recordings,
  }),
  methods: {
    log(recording) {
      console.log("clicked:", recording.id, recording.name);
    },
  },
};
</script>

<style scoped>
.transparent {
  background-color: rgba(56, 56, 56, 0.7) !important;
}
</style>