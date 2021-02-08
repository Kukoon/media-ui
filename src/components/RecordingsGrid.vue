<template>
  <div>
    <div class="my-n1">
      <v-row class="mx-n1">
        <v-col
          v-for="(recording, n) in recordings"
          cols="12"
          md="6"
          :key="recording + n"
        >
          <v-card outlined tile elevation="0">
            <v-responsive :aspect-ratio="16 / 9">
              <router-link to="">
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-img
                      v-ripple="{ class: 'neutral--text', center: true }"
                      :src="recording.thumbnail"
                      class="white--text align-end"
                      gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                      height="100%"
                      width="100%"
                    >
                      <v-fade-transition>
                        <v-overlay
                          v-if="hover"
                          absolute
                          color="accent darken-3"
                        >
                          <v-btn
                            :ripple="false"
                            icon
                            x-large
                            id="no-background-hover"
                          >
                            <v-icon x-large> mdi-play </v-icon>
                          </v-btn>
                        </v-overlay>
                      </v-fade-transition>
                    </v-img>
                  </template>
                </v-hover>
              </router-link>
            </v-responsive>
            <v-card-title>
              {{ recording.name }}
            </v-card-title>
            <v-card-subtitle v-if="recording.subtitle !== undefined">
              {{ recording.subtitle }}
            </v-card-subtitle>
            <!-- Show Tags -->
            <div class="mx-4">
              <RecordingsChips
                :speakers="recording.speakers"
                :tags="recording.tags"
                :length="recording.length"
              />
            </div>
            <v-card-text>
              {{ recording.short }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import recordings from "../data/recordings.json";
import RecordingsChips from "./RecordingsChips.vue";

export default {
  name: "RecordingsGrid",
  components: { RecordingsChips },
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
#no-background-hover::before {
  background-color: transparent !important;
}
</style>