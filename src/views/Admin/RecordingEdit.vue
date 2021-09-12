<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Recording</h3>
        <v-alert
          class="mt-2"
          border="left"
          type="error"
          prominent
          dense
          dismissible
          v-if="confirmRemove"
          v-model="confirmRemove"
        >
          <v-row align="center">
            <v-col class="grow">
              Do you really want to remove this recording? This action cannot be
              undone.
            </v-col>
            <v-col class="shrink">
              <v-btn outlined @click="remove()">Remove</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-divider class="mt-2"></v-divider>
        <v-form class="pa-0 mt-2" @submit="save()">
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Comman Name (used in URLs)"
            v-model="recording.common_name"
            outlined
            dense
            @input="enableSave = true"
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            type="datetime-local"
            label="Duration"
            v-model="recording.duration"
            outlined
            dense
            @input="enableSave = true"
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Poster URL"
            v-model.lazy="recording.poster"
            outlined
            dense
            @input="enableSave = true"
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Preview URL"
            v-model.lazy="recording.preview"
            outlined
            dense
            @input="enableSave = true"
          ></v-text-field>
          <v-switch
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Public (viewable without login)"
            v-model.lazy="recording.public"
            outlined
            dense
            @input="enableSave = true"
          ></v-switch>
          <v-switch
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Listed (visible in overview)"
            v-model.lazy="recording.listed"
            outlined
            dense
            @input="enableSave = true"
          ></v-switch>
          <v-autocomplete
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Tags"
            v-model="recording.tags"
            :items="tags"
            item-text="lang.name"
            item-value="id"
            small-chips
            deletable-chips
            multiple
            filled
            dense
            @input="enableSave = true"
          >
          </v-autocomplete>
          <v-autocomplete
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Event"
            v-model="recording.event_id"
            :items="events"
            item-text="name"
            item-value="id"
            small-chips
            clearable
            filled
            dense
            @input="enableSave = true"
          >
          </v-autocomplete>
          <v-autocomplete
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Speakers"
            v-model="recording.speakers"
            :items="speakers"
            item-text="name"
            item-value="id"
            small-chips
            deletable-chips
            multiple
            filled
            dense
            @input="enableSave = true"
          >
          </v-autocomplete>
          <v-btn
            class="ml-auto mr-1"
            color="sucess"
            @click="save()"
            :disabled="!enableSave"
          >
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
          <v-btn
            class="ml-1"
            color="error"
            @click="confirmRemove = true"
            v-if="recordingid"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-form>
        <v-divider class="mt-4 mb-4" v-if="recordingid" />
        <h4 v-if="recordingid">Descriptions</h4>
	<v-expansion-panels accordion tile class="mt-4" v-if="recordingid && langs.length > 0">
          <v-expansion-panel v-for="lang in langs" :key="lang.id">
            <v-expansion-panel-header>
              <span class="text-truncate">{{ lang.title }}</span>
              <v-chip
                small
                color="success"
                class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
                label
                outlined
              >
               {{ lang.lang }}
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <RecordingLangEdit :recordingid="recordingid" @change-recording="updateLang" :lang="lang" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
	<v-expansion-panels accordion tile class="mt-4" v-if="recordingid">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text-truncate">New Language</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <RecordingLangEdit :recordingid="recordingid" @change-recording="updateLang" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <h4 v-if="recordingid">Formats</h4>
	<v-expansion-panels accordion tile class="mt-4" v-if="recordingid && formats.length > 0">
          <v-expansion-panel v-for="format in formats" :key="format.id">
            <v-expansion-panel-header>
              <span class="text-truncate">{{ format.resolution }}</span>
              <v-chip
                small
                color="green"
                class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
                label
                outlined
		v-if="format.is_video"
              >
               Video
              </v-chip>
              <v-chip
                small
                color="blue"
                class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
                label
                outlined
		v-else
              >
               Audio
              </v-chip>
              <v-chip
                small
                color="orange"
                class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
                label
                outlined
              >
               {{ format.lang }}
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <RecordingFormatEdit :recordingid="recordingid" @change-recording="load" :format="format" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
	<v-expansion-panels accordion tile class="mt-4" v-if="recordingid">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text-truncate">New Format</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <RecordingFormatEdit :recordingid="recordingid" @change-recording="load" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import { models } from "@/services/lib.js";

import RecordingLangEdit from "@/components/RecordingLangEdit.vue";
import RecordingFormatEdit from "@/components/RecordingFormatEdit.vue";

export default {
  name: "RecordingEdit",
  props: ["channelid", "recordingid"],
  components: {
    RecordingLangEdit,
    RecordingFormatEdit,
  },
  data() {
    return {
      recording: {},
      recordingFormDefault: {
        poster: "https://cdn.media.kukoon.de/videos/"+this.channelid+"/"+this.recordingid+"/poster.jpg"
      },
      enableSave: false,
      confirmRemove: false,
      langs: [],
      formats: [],
      tags: [],
      speakers: [],
      events: [],
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    save() {
      let resp = null;
      if (this.recordingid) {
        resp = api.Recordings.Save(this.recordingid, this.recording);
      } else {
        resp = api.Recordings.Add(this.recording);
      }
      resp.then((response) => {
        this.recording = models.Recording.ToRequest(response.data);
      });
    },
    remove() {
      api.Recordings.Delete(this.recordingid).then(() => {
        this.$router.replace({ name: 'RecordingAdd', params: { channelid: this.channelid } });
      });
      this.confirmRemove = false;
    },
    cancel() {
      this.confirmRemove = false;
    },
    loadFilterData() {
      api.Tags.List().then((response) => (this.tags = response.data));
      api.Events.List().then((response) => (this.events = response.data));
      api.Speakers.List().then((response) => (this.speakers = response.data));
    },
    updateLang() {
      api.Recordings.Langs.List(this.recordingid).then((response) => {
        this.langs = response.data;
      });
    },
    load() {
      if (!this.recordingid) {
        this.recording = Object.assign({}, this.recordingFormDefault);
        return;
      }
      api.Recordings.Get(this.recordingid).then((response) => {
        this.recording = models.Recording.ToRequest(response.data);
        this.formats = response.data.formats;
      });
    },
  },
  watch: {
    recordingid() {
      this.updateLang();
      this.load();
    },
  },
  created() {
    this.loadFilterData();
    this.updateLang();
    this.load();
  },
};
</script>
