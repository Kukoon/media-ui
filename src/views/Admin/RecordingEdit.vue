<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Recording</h3>
        <v-alert
          v-if="confirmRemove"
          v-model="confirmRemove"
          class="mt-2"
          border="left"
          type="error"
          prominent
          dense
          dismissible
        >
          <v-row align="center">
            <v-col class="grow">
              Do you really want to remove this recording? This action cannot be
              undone.
            </v-col>
            <v-col class="shrink">
              <v-btn
                outlined
                @click="remove()"
              >
                Remove
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-divider class="mt-2" />
        <v-form
          class="pa-0 mt-2"
          @submit="save()"
        >
          <v-text-field
            v-model="recording.common_name"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Comman Name (used in URLs)"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model="recording.created_at"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Created At"
            type="datetime-local"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model="recording.duration"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            type="number"
            label="Duration"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model.lazy="recording.poster"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Poster URL"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model.lazy="recording.preview"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Preview URL"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-switch
            v-model.lazy="recording.public"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Public (viewable without login)"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-switch
            v-model.lazy="recording.listed"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Listed (visible in overview)"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-autocomplete
            v-model="recording.tags"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Tags"
            :items="tags"
            item-text="lang.name"
            item-value="id"
            small-chips
            deletable-chips
            multiple
            filled
            dense
            @input="enableSave = true"
          />
          <v-autocomplete
            v-model="recording.event_id"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Event"
            :items="events"
            item-text="name"
            item-value="id"
            small-chips
            clearable
            filled
            dense
            @input="enableSave = true"
          />
          <v-autocomplete
            v-model="recording.speakers"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Speakers"
            :items="speakers"
            item-text="name"
            item-value="id"
            small-chips
            deletable-chips
            multiple
            filled
            dense
            @input="enableSave = true"
          />
          <v-btn
            class="ml-auto mr-1"
            color="sucess"
            :disabled="!enableSave"
            @click="save()"
          >
            <v-icon left>
              mdi-content-save
            </v-icon>
            Save
          </v-btn>
          <v-btn
            v-if="recordingid"
            class="ml-1"
            color="error"
            @click="confirmRemove = true"
          >
            <v-icon left>
              mdi-delete
            </v-icon>
            Delete
          </v-btn>
          <v-btn
            v-if="recordingid"
            class="ml-1 float-right"
            color="blue"
            outlined
            :to="{ name: 'Player', params: { id: recordingid} }"
            target="_blank"
          >
            <v-icon left>
              mdi-web
            </v-icon>
            View
          </v-btn>
        </v-form>
        <v-divider
          v-if="recordingid"
          class="mt-4 mb-4"
        />
        <h4 v-if="recordingid">
          Descriptions
        </h4>
        <v-expansion-panels
          v-if="recordingid && langs.length > 0"
          accordion
          tile
          class="mt-4"
        >
          <v-expansion-panel
            v-for="lang in langs"
            :key="lang.id"
          >
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
              <RecordingLangEdit
                :recordingid="recordingid"
                :lang="lang"
                @change-recording="updateLang"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels
          v-if="recordingid"
          accordion
          tile
          class="mt-4"
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text-truncate">New Language</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <RecordingLangEdit
                :recordingid="recordingid"
                @change-recording="updateLang"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <h4 v-if="recordingid">
          Formats
        </h4>
        <v-expansion-panels
          v-if="recordingid && formats.length > 0"
          accordion
          tile
          class="mt-4"
        >
          <v-expansion-panel
            v-for="format in formats"
            :key="format.id"
          >
            <v-expansion-panel-header>
              <span class="text-truncate">{{ format.resolution }}</span>
              <v-chip
                v-if="format.is_video"
                small
                color="green"
                class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
                label
                outlined
              >
                Video
              </v-chip>
              <v-chip
                v-else
                small
                color="blue"
                class="flex-grow-0 flex-shrink-0 pr-3 monospace mr-4"
                label
                outlined
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
              <RecordingFormatEdit
                :recordingid="recordingid"
                :channelid="channelid"
                :format="format"
                @change-recording="load"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels
          v-if="recordingid"
          accordion
          tile
          class="mt-4"
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text-truncate">New Format</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <RecordingFormatEdit
                :recordingid="recordingid"
                :channelid="channelid"
                @change-recording="load"
              />
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
  components: {
    RecordingLangEdit,
    RecordingFormatEdit,
  },
  props: ["channelid", "recordingid"],
  data() {
    return {
      recording: {},
      recordingFormDefault: {
        poster: "https://cdn.media.kukoon.de/videos/"+this.channelid+"/"+this.recordingid+"/poster.jpg",
        preview: "https://cdn.media.kukoon.de/videos/"+this.channelid+"/"+this.recordingid+"/preview.webp",
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
  methods: {
    save() {
      let resp = null;
      const data = models.Recording.ToRequest(this.recording);
      if (this.recordingid) {
        resp = api.Recordings.Save(this.recordingid, data);
      } else {
        resp = api.Recordings.Add(this.channelid, data);
      }
      resp.then((response) => {
        this.recording = models.Recording.FromRequest(response.data);
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
        this.recording = models.Recording.FromRequest(response.data);
        this.formats = response.data.formats ? response.data.formats : [];
      });
    },
  },
};
</script>
