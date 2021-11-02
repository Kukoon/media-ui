<template>
  <v-container fluid>
    <v-snackbar
      v-model="confirmRemove"
      app
      top
      max-width="100%"
      tile
      transition="scroll-y-transition"
    >
      <v-alert
        id="alert"
        v-model="confirmRemove"
        type="error"
        dismissible
        dense
        icon="mdi-alert"
        class="mb-0"
        tile
      >
        <v-row align="center">
          <v-col class="grow">
            Do you really want to remove this Event? This action cannot be
            undone.
          </v-col>
          <v-col class="shrink">
            <v-btn
              small
              outlined
              @click="remove(removeID)"
            >
              Remove
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-snackbar>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3 class="pb-2">
            Recordings
          </h3>
          <v-spacer />
          <v-btn
            icon
            small
            @click="add()"
          >
            <v-icon small>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-row>
        <v-card>
          <v-card-title class="pt-0">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="recordings"
            :search="search"
            sort-by="created_at"
            sort-desc
          >
            <template #item.title="{ item }">
              {{ item.lang.title }}
            </template>
            <template #item.duration="{ item }">
              {{ readableDuration(item.duration) }}
            </template>
            <template #item.listed="{ item }">
              <v-chip
                v-if="item.listed"
                small
                color="deep-purple lighten-3"
                class="ma-1 monospace"
                label
                :text-color="darkMode ? 'black' : ''"
              >
                Listed
              </v-chip>
              <v-chip
                v-else
                small
                :color="darkMode ? 'grey lighten-1' : 'grey lighten-2'"
                class="ma-1 monospace"
                label
                :text-color="darkMode ? 'black' : ''"
              >
                Hidden
              </v-chip>
              <v-chip
                v-if="item.public"
                small
                color="light-green lighten-1"
                class="ma-1 monospace"
                label
                :text-color="darkMode ? 'black' : ''"
              >
                Public
              </v-chip>
              <v-chip
                v-else
                small
                color="orange"
                class="ma-1 monospace"
                label
                :text-color="darkMode ? 'black' : ''"
              >
                Private
              </v-chip>
            </template>
            <template #item.created_at="{ item }">
              {{ readableDate(item.created_at) }}
            </template>
            <template #item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="
                  removeID = item.id;
                  confirmRemove = true;
                "
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { api } from "@/services/api.js";
import prettyMilliseconds from "pretty-ms";
import { mapGetters } from "vuex";

export default {
  name: "ChannelRecordings",
  props: ["channelid"],
  computed: {
    ...mapGetters(["darkMode"]),
  },
  data() {
    return {
      confirmRemove: false,
      channel: { title: "unknown" },
      headers: [
        {
          text: "Title",
          align: "start",
          value: "lang.title",
        },
        { text: "Duration", value: "duration", align: "end" },
        { text: "Views", value: "viewers", align: "end" },
        { text: "Status", value: "listed", sortable: false },
        { text: "Date", value: "created_at", align: "end" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      recordings: [],
      removeID: null,
      search: "",
    };
  },
  watch: {
    channelid() {
      this.load();
      this.loadRecordings();
    },
  },
  created() {
    this.load();
    this.loadRecordings();
  },

  methods: {
    editItem(item) {
      this.$router.push({
        name: "RecordingEdit",
        params: {
          channelid: item.channel.id,
          recordingid: item.id,
        },
      });
    },
    load() {
      api.Channels.Get(this.channelid).then((response) => {
        this.channel = response.data;
      });
    },
    loadRecordings() {
      api.Recordings.ListChannelMy(this.channelid).then((response) => {
        this.recordings = response.data;
      });
    },
    readableDuration(duration) {
      return prettyMilliseconds(duration / 1000000, {
        colonNotation: true,
      });
    },
    readableDate(dateString) {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    remove() {
      api.Recordings.Delete(this.removeID).then(() => {
        this.confirmRemove = false;
        this.loadRecordings();
      });
    },
  },
};
</script>

<style scoped>
.v-snack >>> .v-snack__content {
  padding: 0 !important;
}
.v-snack >>> .v-snack__wrapper {
  display: block;
  margin: 0;
  width: 100% !important;
  min-height: unset !important;
}
</style>