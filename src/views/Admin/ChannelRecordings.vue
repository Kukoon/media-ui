<template>
  <v-container fluid>
    <v-overlay :value="confirmRemove">
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
              Do you really want to remove {{ removeIDs.size }} Event?
            </v-col>
            <v-col class="shrink">
              <v-btn @click="remove()"> Remove </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-snackbar>
    </v-overlay>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3 class="pb-2">Recordings</h3>
          <v-spacer />
          <v-btn
            v-if="selected.length !== 0"
            color="error"
            small
            outlined
            class="mr-2"
            @click="removeSelected()"
          >
            <v-icon small left> mdi-delete </v-icon>
            Remove {{ selected.length }} recordings
          </v-btn>
          <v-btn icon small @click="add()">
            <v-icon small> mdi-plus </v-icon>
          </v-btn>
        </v-row>
        <v-card flat rounded>
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
            show-select
            sort-by="created_at"
            sort-desc
            v-model="selected"
          >
            <template #item.poster="{ item }">
              <v-img
                :src="item.poster"
                alt="Poster"
                height="56"
                max-width="100"
                class="mt-2 mb-2"
                style="cursor: pointer"
                @click="editItem(item, null, 3)"
              />
            </template>
            <template #item.id="{ item }">
              <span
                v-if="item.lang"
                @click="editItem(item, lang, 2)"
                style="cursor: pointer"
              >
                {{ item.lang.title }}
              </span>
              <span
                v-else
                @click="editItem(item, lang, 2)"
                style="cursor: pointer"
              >
                {{ item.common_name ? item.common_name : item.id }}
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
            <template #item.lang_shorts="{ item }">
              <v-chip
                v-for="(lang, i) in item.lang_shorts"
                :key="i"
                class="ma-1 monospace"
                small
                link
                @click="editItem(item, lang, 2)"
              >
                {{ lang.toUpperCase() }}
              </v-chip>
            </template>
            <template #item.formats="{ item }">
              <v-chip
                v-for="(format, i) in item.formats"
                :key="i"
                class="ma-1 monospace"
                small
                link
                @click="editItem(item, null, 4)"
              >
                {{ format.resolution + "[" + format.lang.toUpperCase() + "]" }}
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
                  removeIDs.clear();
                  removeIDs.add(item.id);
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
    <v-btn class="mt-4" color="info" @click="add()">
      <v-icon left> mdi-plus </v-icon>
      Add Recording
    </v-btn>
    <v-dialog
      v-if="showDialog"
      v-model="showDialog"
      width="640"
      content-class="elevation-16"
    >
      <RecordingEditDialog
        :key="dialogKey"
        :channelid="channelid"
        :recordingid="selectedItem.id"
        :createdData="createdData"
        :lang="selectedLang"
        :window="window"
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
        { text: "Poster", value: "poster", sortable: false },
        {
          text: "Title",
          align: "start",
          value: "id",
          width: "15%",
        },
        { text: "Duration", value: "duration", align: "end" },
        { text: "Views", value: "viewers", align: "end" },
        { text: "Status", value: "listed", sortable: false },
        { text: "Languages", value: "lang_shorts", sortable: false },
        { text: "Formats", value: "formats", sortable: false },
        { text: "Created", value: "created_at", align: "end" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      recordings: [],
      removeIDs: new Set(),
      search: "",
      selectedItem: null,
      selectedLang: null,
      showDialog: false,
      singleSelect: false,
      selected: [],
      window: null,
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
    confirmRemove(v) {
      if (!v) {
        this.removeIDs.clear();
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
        this.window = 1;
        this.showDialog = true;
      });
    },
    editItem(item, lang, window) {
      this.selectedItem = item;
      this.selectedLang = lang;
      this.showDialog = true;
      this.window = window;
    },
    load() {
      api.Channels.Get(this.channelid).then((response) => {
        this.channel = response.data.data;
      });
    },
    loadRecordings() {
      this.langs = [];
      this.formats = [];
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
      for (var id of this.removeIDs) {
        api.Recordings.Delete(id).then(() => {
          this.loadRecordings();
          this.removeIDs.delete(id);
          this.selected = [];
          this.confirmRemove = false;
        });
      }
    },
    removeSelected() {
      this.removeIDs.clear();
      this.removeIDs = new Set(this.selected.map((e) => e.id));
      this.confirmRemove = true;
    },
    viewItem(item) {
      const route = this.$router.resolve({
        name: "Player",
        params: { id: item.id },
      });
      window.open(route.href, "_blank");
    },
    closeConfirm() {
      this.confirmRemove = false;
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
