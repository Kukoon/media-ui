<template>
  <v-expansion-panels accordion tile class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span class="text-truncate">Schedule Stream</span>
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
            <v-row no-gutters class="my-1">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Title"
                hide-details
              ></v-text-field>
            </v-row>
            <v-row no-gutters class="d-flex my-1">
              <v-col cols="12" md="8" lg="8">
                <v-menu
                  ref="menuDate"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  :nudge-right="32"
                  :nudge-top="-4"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-bind="attrs"
                      v-on="on"
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      outlined
                      dense
                      label="Date (yyyy-mm-dd)"
                      prepend-icon="mdi-calendar"
                      v-model="date"
                      hide-details
                      class="flex-grow-1 flex-shrink-1 mb-2"
                      @input="$refs.menuDate.save(date)"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    scrollable
                    color="accent lighten-1"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuDate = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menuDate.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <v-menu
                  ref="menuTime"
                  v-model="menuTime"
                  :close-on-content-click="false"
                  :nudge-right="32"
                  :nudge-top="-4"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="time"
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      label="Time (hh:mm)"
                      prepend-icon="mdi-clock-time-four-outline"
                      outlined
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                      class="mb-2"
                      @input="$refs.menuTime.save(time)"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuTime"
                    v-model="time"
                    format="24hr"
                    color="accent lighten-1"
                    full-width
                    @click:minute="$refs.menuTime.save(time)"
                  ></v-time-picker>
                </v-menu>

                <v-file-input
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Poster File (JPG, 1920x1080)"
                  outlined
                  dense
                  hide-details
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="4" lg="4">
                <v-img
                  contain
                  max-height="136"
                  src="https://cdn.media.kukoon.de/videos/df1555f5-7046-4f7a-adcc-195b73949723/a7816cbb-3fab-40e4-a753-a87d2439df7f/poster.jpg"
                  :class="{
                    'ml-2': $vuetify.breakpoint.md,
                    'mt-2': $vuetify.breakpoint.smAndDown,
                  }"
                ></v-img>
              </v-col>
            </v-row>
            <v-row no-gutters class="my-1">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Speakers (separated by comma)"
                hide-details
              ></v-text-field>
            </v-row>
            <v-row no-gutters class="my-1">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="Tags (separated by comma)"
                hide-details
              ></v-text-field>
            </v-row>
            <v-row no-gutters class="my-1">
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
            <v-btn class="ml-auto" color="sucess"> Save </v-btn>
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
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      time: null,
      menuTime: false,
      poster: null,
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