<template>
  <v-container fluid>
    <v-snackbar
      v-model="confirmRemove"
      app
      top
      max-width="100%"
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
      >
        <v-row align="center">
          <v-col class="grow">
            Do you really want to remove this Event? This action cannot be
            undone.
          </v-col>
          <v-col class="shrink">
            <v-btn small outlined @click="remove(removeID)"> Remove </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-snackbar>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3 class="pb-2">Recordings</h3>
          <v-spacer />
          <v-btn icon small @click="add()">
            <v-icon small> mdi-plus </v-icon>
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
            <template #item.lang.title="{ item }">
              <span>
                {{
                  item.lang.title
                    ? item.lang.title
                    : item.common_name
                    ? item.common_name
                    : item.id
                }}
              </span>
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
                :text-color="darkMode ? 'black' : ''"
              >
                <v-icon small left>mdi-playlist-check</v-icon>
                Listed
              </v-chip>
              <v-chip
                v-if="item.public"
                small
                color="light-green lighten-1"
                class="ma-1 monospace"
                :text-color="darkMode ? 'black' : ''"
              >
                <v-icon small left>mdi-checkbox-marked-circle</v-icon>
                Published
              </v-chip>
              <v-chip
                v-else
                small
                color="orange"
                class="ma-1 monospace"
                :text-color="darkMode ? 'black' : ''"
              >
                <v-icon small left>mdi-eye-off</v-icon>
                Private
              </v-chip>
            </template>
            <template #item.created_at="{ item }">
              {{
                readableDate(item.created_at) +
                ", " +
                readableTime(item.created_at)
              }}
            </template>
            <template #item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                small
                class="mr-2"
                @click="
                  removeID = item.id;
                  confirmRemove = true;
                "
              >
                mdi-delete
              </v-icon>
              <v-icon small @click="viewItem(item)"> mdi-open-in-new </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-if="showDialog"
      v-model="showDialog"
      width="540"
      content-class="elevation-16"
    >
      <RecordingEditDialog
        :key="dialogKey"
        :channelid="channelid"
        :recordingid="selectedItem.id"
        :createdData="createdData"
        @loadRecordings="loadRecordings"
        @closeDialog="showDialog = false"
        @keydown.esc="showDialog = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { api } from "@/services/api.js";
import { models } from "@/services/lib.js";

import prettyMilliseconds from "pretty-ms";

import RecordingEditDialog from "@/components/RecordingEditDialog.vue";

export default {
  name: "ChannelRecordings",
  props: ["channelid"],
  components: { RecordingEditDialog },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  data() {
    return {
      createdData: {},
      confirmRemove: false,
      channel: { title: "unknown" },
      dialogKey: 0,
      headers: [
        {
          text: "Title",
          align: "start",
          value: "lang.title",
        },
        { text: "Duration", value: "duration", align: "end" },
        { text: "Views", value: "viewers", align: "end" },
        { text: "Status", value: "listed", sortable: false },
        { text: "Created", value: "created_at", align: "end" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      recordings: [],
      removeID: null,
      search: "",
      selectedItem: null,
      showDialog: false,
    };
  },
  watch: {
    channelid() {
      this.load();
      this.loadRecordings();
    },
    selectedOpen() {
      if (!this.showDialog) {
        this.dialogKey += 1;
      }
    },
  },
  created() {
    this.load();
    this.loadRecordings();
  },

  methods: {
    add() {
      this.createdData = models.Recording.ToRequest({
        created_at: new Date().toJSON(),
      });
      api.Recordings.Add(this.channelid, this.createdData).then((resp) => {
        this.selectedItem = resp.data;
        this.showDialog = true;
      });
    },
    editItem(item) {
      this.selectedItem = item;
      this.showDialog = true;
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
        month: "short",
        day: "numeric",
      });
    },
    readableTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    remove() {
      api.Recordings.Delete(this.removeID).then(() => {
        this.confirmRemove = false;
        this.loadRecordings();
      });
    },
    viewItem(item) {
      const route = this.$router.resolve({
        name: "Player",
        params: { id: item.id },
      });
      window.open(route.href, "_blank");
    },
  },
};
</script>

<style scoped>
#alert {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.v-snack >>> .v-snack__content {
  padding: 0 !important;
}
.v-snack >>> .v-snack__wrapper {
  display: block;
  margin: 0;
  width: 60% !important;
  min-height: unset !important;
}
</style>