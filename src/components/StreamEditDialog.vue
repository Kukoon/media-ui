<template>
  <v-card width="100%">
    <v-row class="d-flex" no-gutters>
      <v-card width="8px" :color="streamColor" tile></v-card>
      <div class="d-flex flex-column flex-grow-1">
        <v-card-title class="text-h6 font-weight-regular">
          <span>{{ currentTitle }}</span>
          <v-spacer />
          <v-menu
            offset-x
            nudge-right="10"
            :close-on-content-click="true"
            max-width="240"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon class="mr-auto" v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list flat dense>
              <v-list-item-group>
                <v-list-item
                  :to="{
                    name: 'StreamEdit',
                    params: {
                      channelid: channelid,
                      streamid: streamid,
                    },
                  }"
                >
                  <v-list-item-title>Edit </v-list-item-title>
                </v-list-item>
                <v-list-item @click="exportToRecording()">
                  <v-list-item-title>Save to Recordings</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove()">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-card-subtitle>{{ step + "/4" }} </v-card-subtitle>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-form class="pa-0 mt-2" @submit="save()" :disabled="!loaded">
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Comman Name (used in URLs)"
                  v-model="stream.common_name"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-text-field>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  type="datetime-local"
                  label="Listen At (hidden till)"
                  v-model="stream.listen_at"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-text-field>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  type="datetime-local"
                  label="Planned Start"
                  v-model="stream.start_at"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-text-field>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  type="datetime-local"
                  label="Planned End"
                  v-model="stream.end_at"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-text-field>
                <v-switch
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Chat"
                  v-model.lazy="stream.chat"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-switch>
              </v-form>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text>
              <v-form class="pa-0 mt-2" @submit="save()">
                <v-autocomplete
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Language"
                  v-model="selectedLang"
                  :items="langAbbrs"
                  auto-select-first
                  minlength="2"
                  maxlength="2"
                  outlined
                  dense
                  @input="(enableSave = true), updateLangForm()"
                >
                  <template v-slot:append-outer>
                    <v-menu
                      v-model="showAddLang"
                      offset-y
                      nudge-right="12"
                      :close-on-content-click="false"
                      max-width="200"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon left v-bind="attrs" v-on="on">mdi-plus</v-icon>
                      </template>
                      <v-card width="100%">
                        <v-list class="pt-4">
                          <v-list-item>
                            <v-text-field
                              :color="
                                darkMode ? 'grey lighten-3' : 'grey darken-2'
                              "
                              label="Language (short)"
                              v-model="newLang"
                              dense
                              outlined
                              :rules="[rules.notExist]"
                            ></v-text-field> </v-list-item
                        ></v-list>
                        <v-card-actions class="pt-0">
                          <v-spacer></v-spacer>
                          <v-btn text @click="showAddLang = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            color="success"
                            text
                            @click="addLang()"
                            :disabled="langAbbrs.includes(newLang)"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </template>
                </v-autocomplete>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Title"
                  v-model="langForm.title"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-text-field>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Subtitle"
                  v-model.lazy="langForm.subtitle"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-text-field>
                <v-textarea
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Short Description"
                  v-model.lazy="langForm.short"
                  outlined
                  dense
                  height="70"
                  @input="enableSave = true"
                ></v-textarea>
                <v-textarea
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Description"
                  v-model.lazy="langForm.long"
                  outlined
                  dense
                  @input="enableSave = true"
                ></v-textarea
              ></v-form>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="3">
            <v-card-text>
              <v-responsive :aspect-ratio="16 / 9" class="mb-6">
                <v-img
                  v-if="video.poster"
                  :aspect-ratio="16 / 9"
                  :src="video.poster"
                  gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                  height="100%"
                  width="100%"
                  style="border-radius: 4px"
                ></v-img>
                <v-btn v-else height="100%" width="100%">Upload Poster</v-btn>
              </v-responsive>
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Poster URL"
                v-model.lazy="stream.poster"
                outlined
                dense
                @input="enableSave = true"
              ></v-text-field>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="4">
            <v-card-text>
              <v-autocomplete
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Tags"
                v-model="stream.tags"
                :items="tags"
                item-text="lang.name"
                item-value="id"
                small-chips
                deletable-chips
                multiple
                outlined
                dense
                @input="enableSave = true"
              >
              </v-autocomplete>
              <v-autocomplete
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Events"
                v-model="stream.events"
                :items="events"
                item-text="name"
                item-value="id"
                small-chips
                clearable
                outlined
                dense
                @input="enableSave = true"
              >
              </v-autocomplete>
              <v-autocomplete
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Speakers"
                v-model="stream.speakers"
                :items="speakers"
                item-text="name"
                item-value="id"
                small-chips
                deletable-chips
                multiple
                outlined
                dense
                @input="enableSave = true"
              >
              </v-autocomplete>
            </v-card-text>
          </v-window-item>
        </v-window>
      </div>
    </v-row>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="cancel()"> Cancel </v-btn>
      <v-btn v-if="step !== 4" color="primary" depressed @click="step++">
        Continue
      </v-btn>
      <v-btn v-else color="success" @click="save()">Save</v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import { models } from "@/services/lib.js";

export default {
  name: "StreamEditDialog",
  props: ["video", "channelid", "streamid", "streamColor"],
  data() {
    return {
      events: [],
      langForm: {},
      langs: [],
      langExists: false,
      loaded: false,
      newLang: "",
      selectedLang: null,
      showAddLang: false,
      speakers: [],
      step: 1,
      stream: {},
      streamFormDefault: {
        poster:
          "https://cdn.media.kukoon.de/videos/" +
          this.channelid +
          "/" +
          this.streamid +
          "/poster.jpg",
      },
      tags: [],
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Settings";
        case 2:
          return "Title and Description";
        case 3:
          return "Poster";
        default:
          return "Metadata";
      }
    },
    langAbbrs() {
      return [...new Set(this.langs.map((item) => item.lang))];
    },
    rules() {
      return {
        notExist:
          !this.langAbbrs.includes(this.newLang) || "Language already exists!",
      };
    },
  },
  methods: {
    addLang() {
      let resp = null;
      const langForm = {
        lang: this.newLang,
      };
      if (!this.langAbbrs.includes(this.newLang)) {
        resp = api.Streams.Langs.Add(this.streamid, langForm);
        resp.then(() => {
          this.loadLangs();
        });
        this.newLang = "";
        this.langExists = "false";
        this.showAddLang = false;
      } else {
        this.langExists = "true";
      }
    },
    cancel() {
      this.$emit("closeDialog");
      this.step = 1;
    },
    exportToRecording() {
      api.Streams.Export(this.streamid);
    },
    load() {
      if (!this.streamid) {
        this.stream = Object.assign({}, this.streamFormDefault);
        return;
      }
      api.Streams.Get(this.streamid).then((response) => {
        this.stream = models.Stream.FromRequest(response.data);
        this.loaded = true;
      });
    },
    loadFilterData() {
      api.Tags.List().then((response) => (this.tags = response.data));
      api.Events.List().then((response) => (this.events = response.data));
      api.Speakers.List().then((response) => (this.speakers = response.data));
    },
    loadLangs() {
      api.Streams.Langs.List(this.streamid).then((response) => {
        this.langs = response.data;
        if (this.langAbbrs.includes(this.$store.getters.language)) {
          this.selectedLang = this.$store.getters.language;
        }
        this.updateLangForm();
      });
    },
    updateLangForm() {
      if (
        this.langs.filter((item) => item.lang === this.selectedLang).length > 0
      ) {
        this.langForm = Object.assign(
          this.langs.find((item) => item.lang === this.selectedLang)
        );
      } else {
        this.langForm = {};
      }
    },
    remove() {
      api.Streams.Delete(this.streamid).then(() => {
        this.step = 1;
        this.$emit("loadStreams", this.streamid);
        this.$emit("closeDialog");
      });
    },
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
        for (const lang of this.langs) {
          if (lang.id) {
            resp = api.Streams.Langs.Save(lang.id, lang);
          }
          resp.then(() => {
            this.loadLangs();
          });
        }
        this.step = 1;
        this.$emit("loadStreams");
        this.$emit("closeDialog");
      });
    },
  },
  mounted() {
    this.loadFilterData();
    this.loadLangs();
  },
  created() {
    this.load();
  },
  watch: {
    streamid() {
      this.loadFilterData();
      this.loadLangs();
      this.load();
    },
  },
};
</script>
