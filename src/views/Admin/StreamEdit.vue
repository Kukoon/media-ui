<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Stream</h3>
        <v-alert
          v-if="confirmRemove"
          v-model="confirmRemove"
          class="mt-2"
          border="left"
          type="error"
          dense
          dismissible
        >
          <v-row align="center">
            <v-col class="grow">
              Do you really want to remove this stream? This action cannot be
              undone.
            </v-col>
            <v-col class="shrink">
              <v-btn small outlined @click="remove()"> Remove </v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-divider class="mt-2" />
        <v-form class="pa-0 mt-2" @submit="save()">
          <v-text-field
            v-model="stream.common_name"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Comman Name (used in URLs)"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model="stream.listen_at"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            type="datetime-local"
            label="Listen At (hidden till)"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model="stream.start_at"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            type="datetime-local"
            label="Planned Start"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model="stream.end_at"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            type="datetime-local"
            label="Planned End"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model.lazy="stream.poster"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Poster URL"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-text-field
            v-model.lazy="stream.preview"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Preview URL"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-switch
            v-model.lazy="stream.chat"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Chat"
            outlined
            dense
            @input="enableSave = true"
          />
          <v-autocomplete
            v-model="stream.tags"
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
            v-model="stream.event_id"
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
            v-model="stream.speakers"
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
            color="success"
            :disabled="!enableSave"
            @click="save()"
          >
            <v-icon left> mdi-content-save </v-icon>
            Save
          </v-btn>
          <v-btn
            v-if="streamid"
            class="ml-1"
            color="error"
            @click="confirmRemove = true"
          >
            <v-icon left> mdi-delete </v-icon>
            Delete
          </v-btn>
        </v-form>
        <v-divider v-if="streamid" class="mt-4 mb-4" />
        <h4 v-if="streamid">Descriptions</h4>
        <v-expansion-panels
          v-if="streamid && langs.length > 0"
          accordion
          tile
          class="mt-4"
        >
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
              <StreamLangEdit
                :streamid="streamid"
                :lang="lang"
                @change-stream="updateLang"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels v-if="streamid" accordion tile class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text-truncate">New Language</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <StreamLangEdit
                :streamid="streamid"
                @change-stream="updateLang"
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

import StreamLangEdit from "@/components/StreamLangEdit.vue";

export default {
  name: "StreamEdit",
  components: {
    StreamLangEdit,
  },
  props: ["channelid", "streamid"],
  data() {
    return {
      stream: {},
      streamFormDefault: {
        poster:
          "https://cdn.media.kukoon.de/videos/" +
          this.channelid +
          "/" +
          this.streamid +
          "/poster.jpg",
      },
      enableSave: false,
      confirmRemove: false,
      langs: [],
      tags: [],
      speakers: [],
      events: [],
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    streamid() {
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
      const data = models.Stream.ToRequest(this.stream);
      if (this.streamid) {
        resp = api.Streams.Save(this.streamid, data);
      } else {
        resp = api.Streams.Add(data);
      }
      resp.then((response) => {
        this.stream = models.Stream.FromRequest(response.data);
      });
    },
    remove() {
      api.Streams.Delete(this.streamid).then(() => {
        this.$router.replace({
          name: "StreamAdd",
          params: { channelid: this.channelid },
        });
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
      api.Streams.Langs.List(this.streamid).then((response) => {
        this.langs = response.data;
      });
    },
    load() {
      if (!this.streamid) {
        this.stream = Object.assign({}, this.streamFormDefault);
        return;
      }
      api.Streams.Get(this.streamid).then((response) => {
        this.stream = models.Stream.FromRequest(response.data);
      });
    },
  },
};
</script>
