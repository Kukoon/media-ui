<template>
  <div>
    <div
      class="my-n1 px-2"
      v-for="(recording, n) in recordings"
      :key="recording + n"
    >
      <v-row dense class="mx-n3">
        <v-col cols="12" md="4" class="px-3">
          <router-link to="">
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card
                  aspect-ratio="1,7"
                  outlined
                  tile
                  elevation="0"
                  v-ripple="{ class: 'neutral--text', center: true }"
                >
                  <v-img
                    :src="recording.thumbnail"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                    height="100%"
                    width="100%"
                  >
                  </v-img>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute color="accent darken-3">
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
                </v-card>
              </template>
            </v-hover>
          </router-link>
        </v-col>
        <v-col cols="12" md="8" class="px-3">
          <v-card-title class="mx-n3 mt-n4">
            {{ recording.name }}
          </v-card-title>
          <v-card-subtitle
            v-if="recording.subtitle !== undefined"
            class="mx-n3"
          >
            {{ recording.subtitle }}
          </v-card-subtitle>
          <v-card-text class="mx-n3 pb-2">
            {{ recording.short }}
          </v-card-text>
          <!-- Show Tags -->
          <RecordingsChips
            :speakers="recording.speakers"
            :tags="recording.tags"
            :length="recording.length"
          />
        </v-col>
      </v-row>
      <v-divider
        v-if="n < recordings.length - 1"
        class="my-6 mx-16"
      ></v-divider>
    </div>
  </div>
</template>

<script>
import recordings from "../data/recordings.json";
import RecordingsChips from "./RecordingsChips.vue";

export default {
  name: "RecordingsList",
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