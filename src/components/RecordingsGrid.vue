<template>
  <v-container fluid>
    <div class="mx-n5 my-n3">
      <v-row class="ma-1">
        <v-col v-for="(recording, n) in recordings" cols="12" md="6" :key="n">
          <v-card
            color="grey darken-4"
            outlined
            tile
            elevation="0"
            @click="log(recording)"
          >
            <v-responsive :aspect-ratio="16 / 9">
              <v-img
                :src="recording.thumbnail"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                height="100%"
                width="100%"
              >
                <v-card-title class="grey darken-4">
                  {{ recording.name }}
                </v-card-title>
                <v-card-subtitle class="white--text grey darken-4">
                  {{ recording.subtitle }}
                </v-card-subtitle>
              </v-img>
            </v-responsive>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import recordings from "../data/recordings.json";

export default {
  name: "RecordingsGrid",
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