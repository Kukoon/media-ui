<template>
  <v-expansion-panels accordion tile class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span class="text-truncate">Current Stream</span>
        <v-chip
          v-if="running"
          small
          label
          outlined
          color="warning"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
        >
          Live
        </v-chip>
        <v-chip
          v-if="record"
          small
          label
          outlined
          color="warning"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
        >
          Record
        </v-chip>
        <v-chip
          v-if="chat"
          small
          label
          outlined
          color="warning"
          class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
        >
          Chat
        </v-chip>
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
            <v-row no-gutters class="d-flex">
              <v-col>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  outlined
                  dense
                  label="Date (yyyy-mm-dd)"
                  hide-details
                  class="mr-2 flex-grow-1 flex-shrink-1"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  outlined
                  dense
                  label="Time (hh:mm)"
                  hide-details
                  class="ml-2 flex-grow-1 flex-shrink-1"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex align-center">
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
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Speakers (separated by comma)"
                hide-details
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Tags (separated by comma)"
                hide-details
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-textarea
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                dense
                rows="10"
                outlined
                label="Description (using markdown syntax)"
                hide-details
              ></v-textarea>
            </v-row>
            <v-row no-gutters dense>
              <v-switch
                :value="record"
                :input-value="record"
                @change="toggleRecord"
                class="pt-4 pb-4 px-2 ma-0"
                hide-details
                label="Record Stream"
                color="primary lighten-3"
              ></v-switch>
              <v-switch
                :value="chat"
                :input-value="chat"
                @change="toggleChat"
                class="pt-4 pb-4 px-2 ma-0"
                hide-details
                label="Enable Chat"
                color="primary lighten-3"
              ></v-switch>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-0 pt-4">
            <v-btn outlined> Cancel </v-btn>
            <v-btn class="ml-auto" color="primary lighten-3"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StreamCurrent",
  data() {
    return {
      chat: true,
      record: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode", "running"]),
  },
  methods: {
    toggleChat() {
      this.chat = !this.chat;
    },
    toggleRecord() {
      this.record = !this.record;
    },
  },
};
</script>

<style scoped>
.monospace {
  font-family: monospace;
}
</style>