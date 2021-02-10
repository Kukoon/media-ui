<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Videos</h3>
        <v-divider class="mt-2"></v-divider>
        <v-expansion-panels accordion tile class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span>Upload</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card tile elevation="0" class="pa-0">
                <v-card-text class="pa-0 d-flex flex-column justify-end">
                  <v-row no-gutters>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      outlined
                      dense
                      label="Title"
                      hide-details
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters class="d-flex align-center">
                    <v-btn>Browse</v-btn>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      hide-details
                      class="ml-2"
                      outlined
                      readonly
                      disabled
                      dense
                      label="Thumbnail"
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters class="d-flex align-center">
                    <v-btn>Browse</v-btn>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      hide-details
                      class="ml-2"
                      outlined
                      readonly
                      disabled
                      dense
                      label="Video File"
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      outlined
                      dense
                      label="Tags (separated by comma)"
                      hide-details
                      >Title</v-text-field
                    >
                  </v-row>
                  <v-row no-gutters>
                    <v-textarea
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      dense
                      outlined
                      label="Description (using markdown syntax)"
                    ></v-textarea>
                  </v-row>
                </v-card-text>
                <v-card-actions class="pa-0">
                  <v-btn class="ml-auto" color="primary lighten-3">
                    Upload
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels accordion tile class="mt-4">
          <v-expansion-panel v-for="(video, i) in videos" :key="i">
            <v-expansion-panel-header>
              <span class="text-truncate">
                {{ video.name }}
              </span>
              <v-chip
                v-if="video.published"
                small
                color="success"
                class="flex-grow-0 monospace pr-3 monospace mr-4"
                label
                outlined
                >Public</v-chip
              >
              <v-chip
                v-else
                small
                color="warning"
                class="flex-grow-0 monospace pr-3 monospace mr-4"
                label
                outlined
                >Private</v-chip
              >
              <v-chip
                small
                label
                outlined
                class="flex-grow-0 monospace pr-3 mr-4"
              >
                {{ video.date }}
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card tile elevation="0" class="pa-0 mt-2">
                <v-card-text class="pa-0 d-flex flex-column justify-end">
                  <v-row no-gutters>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      outlined
                      dense
                      label="Title"
                      hide-details
                      v-model="video.name"
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters class="d-flex align-center">
                    <v-btn color="primary lighten-1">Browse</v-btn>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      hide-details
                      class="ml-2"
                      outlined
                      readonly
                      disabled
                      dense
                      label="Thumbnail"
                      v-model="video.poster"
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters class="d-flex align-center">
                    <v-btn color="primary lighten-1">Browse</v-btn>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      hide-details
                      class="ml-2"
                      outlined
                      readonly
                      disabled
                      dense
                      label="Video File"
                      v-model="video.source"
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      outlined
                      dense
                      label="Tags (separated by comma)"
                      hide-details
                      v-model="video.tags"
                    ></v-text-field>
                  </v-row>
                  <v-row no-gutters>
                    <v-textarea
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      dense
                      rows="10"
                      outlined
                      label="Description (using markdown syntax)"
                      v-model="video.desc"
                      hide-details
                    ></v-textarea>
                  </v-row>
                  <v-row no-gutters dense>
                    <v-switch
                      class="pt-4 pb-4 ma-0"
                      hide-details
                      label="Public"
                      color="primary lighten-3"
                    ></v-switch>
                  </v-row>
                </v-card-text>
                <v-card-actions class="pa-0">
                  <v-btn class="ml-auto" color="primary lighten-3">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoData from "../../data/VideoData.json";
import { mapGetters } from "vuex";

export default {
  name: "Videos",
  data() {
    return {
      videos: VideoData,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
};
</script>

<style scoped>
.monospace {
  font-family: monospace;
}
</style>