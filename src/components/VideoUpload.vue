<template>
  <v-expansion-panels accordion tile class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span>Upload</span>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card tile elevation="0" class="pa-0">
          <v-card-text class="pa-0 d-flex flex-column justify-end">
            <v-row no-gutters class="my-1">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Title"
                hide-details
              />
            </v-row>
            <v-row no-gutters class="d-flex align-center my-1">
              <v-btn
                :color="darkMode ? 'neutral lighten-3' : 'neutral'"
                class="mr-4 flex-grow-0 flex-shrink-0 hidden-sm-and-down"
              >
                <span>Browse</span>
              </v-btn>
              <v-btn icon class="mr-2 hidden-md-and-up">
                <v-icon>mdi-folder-outline</v-icon>
              </v-btn>
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                hide-details
                class="flex-shrink-1 flex-grow-1"
                outlined
                readonly
                disabled
                dense
                label="Thumbnail File"
              />
            </v-row>
            <v-row no-gutters class="d-flex align-center my-1">
              <v-btn
                :color="darkMode ? 'neutral lighten-3' : 'neutral'"
                class="mr-4 flex-grow-0 flex-shrink-0 hidden-sm-and-down"
              >
                <span>Browse</span>
              </v-btn>
              <v-btn icon class="mr-2 hidden-md-and-up">
                <v-icon>mdi-folder-outline</v-icon>
              </v-btn>
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                hide-details
                class="flex-shrink-1 flex-grow-1"
                outlined
                readonly
                disabled
                dense
                label="Video File"
              />
            </v-row>
            <v-row no-gutters class="my-1">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Speakers (separated by comma)"
                hide-details
              />
            </v-row>
            <v-row no-gutters class="my-1">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Tags (separated by comma)"
                hide-details
              />
            </v-row>
            <v-row no-gutters class="my-1">
              <v-textarea
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                dense
                rows="10"
                outlined
                label="Description (using markdown syntax)"
                hide-details
              />
            </v-row>
          </v-card-text>
          <v-card-actions class="px-0 pt-4">
            <v-btn outlined> Cancel </v-btn>
            <v-btn class="ml-auto" color="success"> Upload </v-btn>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "VideoUpload",
  computed: {
    ...mapGetters(["darkMode"]),
  },
};
</script>