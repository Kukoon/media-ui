<template>
  <v-card width="100%" :color="darkMode ? 'neutral lighten-2' : 'white'">
    <v-row class="d-flex" no-gutters>
      <v-card width="8px" :color="streamColor" tile />
      <div class="d-flex flex-column flex-grow-1">
        <v-card-title class="text-h6 font-weight-regular">
          <span>{{ currentTitle }}</span>
          <v-spacer />
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="24"
            class="mr-1"
          />
          <v-icon
            v-else
            icon
            class="mr-1"
            :disabled="Object.entries(savedStreamData).length <= 0 || loading"
            :color="enableSave && !loading ? 'success' : 'error'"
          >
            mdi-lock
          </v-icon>
          <v-menu
            offset-x
            nudge-right="10"
            :close-on-content-click="true"
            max-width="240"
          >
            <template #activator="{ on, attrs }">
              <v-btn icon class="mr-auto" v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
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
              <v-form class="pa-0 mt-2" :disabled="!loaded" @submit="save()">
                <v-text-field
                  v-model.lazy="stream.common_name"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Comman Name (used in URLs)"
                  outlined
                  dense
                  @change="autoSave()"
                />
                <v-text-field
                  v-model="stream.listen_at"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  type="datetime-local"
                  label="Listen At (hidden till)"
                  outlined
                  dense
                  @change="autoSave()"
                />
                <v-text-field
                  v-model="stream.start_at"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  type="datetime-local"
                  label="Planned Start"
                  outlined
                  dense
                  @change="autoSave()"
                />
                <v-text-field
                  v-model="stream.end_at"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  type="datetime-local"
                  label="Planned End"
                  outlined
                  dense
                  @change="autoSave()"
                />
                <v-switch
                  v-model.lazy="stream.chat"
                  color="success"
                  label="Chat"
                  outlined
                  dense
                  @change="autoSave()"
                />
              </v-form>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text>
              <v-form class="pa-0 mt-2" @submit="save()">
                <v-autocomplete
                  v-model="selectedLang"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Language"
                  :items="langAbbrs"
                  auto-select-first
                  minlength="2"
                  maxlength="2"
                  outlined
                  dense
                  @input="updateLangForm()"
                >
                  <template #append-outer>
                    <v-menu
                      v-model="showAddLang"
                      offset-y
                      nudge-right="12"
                      :close-on-content-click="false"
                      max-width="200"
                    >
                      <template #activator="{ on, attrs }">
                        <v-icon left v-bind="attrs" v-on="on">
                          mdi-plus
                        </v-icon>
                      </template>
                      <v-card width="100%">
                        <v-list class="pt-4">
                          <v-list-item>
                            <v-text-field
                              v-model="newLang"
                              :color="
                                darkMode ? 'grey lighten-3' : 'grey darken-2'
                              "
                              label="Language (short)"
                              dense
                              outlined
                              :rules="[rules.notExist]"
                            />
                          </v-list-item>
                        </v-list>
                        <v-card-actions class="pt-0">
                          <v-spacer />
                          <v-btn text @click="showAddLang = false">
                            Close
                          </v-btn>
                          <v-btn
                            color="success"
                            text
                            :disabled="langAbbrs.includes(newLang)"
                            @click="addLang()"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </template>
                </v-autocomplete>
                <v-text-field
                  v-model.lazy="langForm.title"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Title"
                  outlined
                  dense
                  @change="autoSave()"
                />
                <v-text-field
                  v-model.lazy="langForm.subtitle"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Subtitle"
                  outlined
                  dense
                  @change="autoSave()"
                />
                <v-textarea
                  v-model.lazy="langForm.short"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Short Description"
                  outlined
                  dense
                  height="70"
                  @change="autoSave()"
                />
                <v-textarea
                  v-model.lazy="langForm.long"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Description"
                  outlined
                  dense
                  @change="autoSave()"
                />
              </v-form>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="3">
            <v-card-text>
              <v-responsive :aspect-ratio="16 / 9" class="mb-6">
                <v-img
                  v-if="stream.poster"
                  :aspect-ratio="16 / 9"
                  :src="stream.poster"
                  gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                  height="100%"
                  width="100%"
                  style="border-radius: 4px"
                />
                <v-btn v-else height="100%" width="100%"> Upload Poster </v-btn>
              </v-responsive>
              <v-text-field
                v-model.lazy="stream.poster"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Poster URL"
                outlined
                dense
                @change="autoSave()"
              />
            </v-card-text>
          </v-window-item>
          <v-window-item :value="4">
            <v-card-text>
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
                outlined
                dense
                @change="autoSave()"
              />
              <v-autocomplete
                v-model="stream.events"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Events"
                :items="events"
                item-text="name"
                item-value="id"
                small-chips
                clearable
                outlined
                dense
                @change="autoSave()"
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
                outlined
                dense
                @change="autoSave()"
              />
            </v-card-text>
          </v-window-item>
        </v-window>
      </div>
    </v-row>
    <v-divider />
    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
      <v-spacer />
      <v-btn text @click="close()"> Close </v-btn>
      <v-btn v-if="step !== 4" color="primary" depressed @click="step++">
        Continue
      </v-btn>
      <v-btn v-else color="success" @click="save()"> Save </v-btn>
    </v-card-actions>
    <slot />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import { models } from "@/services/lib.js";

export default {
  name: "StreamEditDialog",
  props: ["channelid", "streamid", "streamColor"],
  data() {
    return {
      events: [],
      keepOpen: false,
      langForm: {},
      langs: [],
      langExists: false,
      loaded: false,
      loading: false,
      newLang: "",
      savedStreamData: {},
      savedLangs: {},
      savedCurrentLang: {},
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
    enableSave() {
      let langsEqual;
      if (
        Object.keys(this.savedStreamData).length !== 0 &&
        Object.keys(this.langForm).length !== 0
      ) {
        langsEqual = this.shallowEqual(this.savedCurrentLang, this.langForm);
      } else {
        langsEqual = true;
      }
      return this.shallowEqual(this.stream, this.savedStreamData) && langsEqual;
    },
  },
  watch: {
    streamid() {
      this.loadFilterData();
      this.loadLangs();
      this.load();
    },
  },
  mounted() {
    this.loadFilterData();
    this.loadLangs();
  },
  created() {
    this.load();
  },
  methods: {
    addLang() {
      let resp = null;
      const langForm = {
        lang: this.newLang,
      };
      if (!this.langAbbrs.includes(this.newLang)) {
        const newLang = this.newLang;
        resp = api.Streams.Langs.Add(this.streamid, langForm);
        resp.then(() => {
          this.loadLangs(newLang);
        });
        this.newLang = "";
        this.langExists = "false";
        this.showAddLang = false;
      } else {
        this.langExists = "true";
      }
    },
    close() {
      this.$emit("closeDialog");
      this.step = 1;
    },
    reset() {
      this.stream = Object.assign({}, this.streamFormDefault);
    },
    exportToRecording() {
      api.Streams.Export(this.streamid).then(this.close).then(this.reset);
    },
    load() {
      if (!this.streamid) {
        this.reset();
        this.savedStreamData = { ...this.stream };
        return;
      }
      api.Streams.Get(this.streamid).then((response) => {
        this.stream = models.Stream.FromRequest(response.data);
        this.savedStreamData = { ...this.stream };
        this.loaded = true;
      });
    },
    loadFilterData() {
      api.Tags.List().then((response) => (this.tags = response.data));
      api.Events.List().then((response) => (this.events = response.data));
      api.Speakers.List().then((response) => (this.speakers = response.data));
    },
    loadLangs(newLang) {
      api.Streams.Langs.List(this.streamid).then((response) => {
        this.langs = response.data;
        if (newLang) {
          this.selectedLang = newLang;
        } else if (this.langAbbrs.includes(this.$store.getters.language)) {
          this.selectedLang = this.$store.getters.language;
        }
        this.updateLangForm();
        this.savedLangs = this.langs.map((a) => {
          return { ...a };
        });
        this.savedCurrentLang = this.savedLangs.find(
          (item) => item.id === this.langForm.id
        );
        this.loading = false;
      });
    },
    updateLangForm() {
      if (
        this.langs.filter((item) => item.lang === this.selectedLang).length > 0
      ) {
        this.langForm = Object.assign(
          this.langs.find((item) => item.lang === this.selectedLang)
        );
        if (Object.keys(this.savedLangs).length > 0) {
          this.savedCurrentLang = this.savedLangs.find(
            (item) => item.id === this.langForm.id
          );
        }
      } else {
        this.langForm = {};
      }
    },
    remove() {
      api.Streams.Delete(this.streamid).then(() => {
        this.close();
        this.reset();
        this.$emit("loadStreams");
      });
    },
    autoSave() {
      if (!this.enableSave) {
        this.keepOpen = true;
        setTimeout(() => {
          this.save();
        }, 500);
      }
    },
    save() {
      let resp = null;
      this.loading = true;
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
        if (this.langs.length === 0) {
          this.loading = false;
        }
        this.$emit("loadStreams");
        if (!this.keepOpen) {
          this.close();
        }
        this.keepOpen = false;
        this.savedStreamData = { ...this.stream };
        // this.savedLangs = { ...this.langs };
      });
    },
    shallowEqual(object1, object2) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let key of keys1) {
        if (object1[key] !== object2[key]) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
