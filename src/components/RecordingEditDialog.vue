<template>
  <v-card width="100%" :color="darkMode ? 'neutral lighten-2' : 'white'">
    <v-card-title class="text-h6 font-weight-regular">
      <span>{{ currentTitle }}</span>
      <v-spacer />
      <v-chip
        v-if="savedRecData.listed"
        small
        color="deep-purple lighten-3"
        class="ma-1 monospace"
        :text-color="darkMode ? 'black' : ''"
      >
        <v-icon small left>mdi-playlist-check</v-icon>
        Listed
      </v-chip>
      <v-chip
        v-if="savedRecData.public"
        small
        color="light-green lighten-1"
        class="ma-1 monospace mr-4"
        :text-color="darkMode ? 'black' : ''"
      >
        <v-icon small left>mdi-checkbox-marked-circle</v-icon>
        Published
      </v-chip>
      <v-chip
        v-if="!savedRecData.public"
        small
        color="orange"
        class="ma-1 monospace mr-4"
        :text-color="darkMode ? 'black' : ''"
      >
        <v-icon small left>mdi-eye-off</v-icon>
        Private
      </v-chip>
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
        :disabled="Object.entries(savedRecData).length <= 0 || loading"
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
            <v-list-item @click="remove()">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle>{{ step + "/3" }} </v-card-subtitle>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-form class="pa-0" :disabled="!loaded" @submit="save()">
            <v-responsive
              v-if="recording.poster"
              :aspect-ratio="16 / 9"
              class="mb-6"
            >
              <div
                @mouseenter="showPreview = true"
                @mouseleave="showPreview = false"
              >
                <v-img
                  v-if="showPreview"
                  v-ripple="{ class: 'neutral--text', center: true }"
                  :src="recording.preview"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                  height="100%"
                  width="100%"
                  style="position: absolute"
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-btn height="100%" width="100%">Upload Preview</v-btn>
                    </v-row>
                  </template>
                </v-img>
                <transition name="fade" appear>
                  <v-img
                    v-if="!showPreview"
                    v-ripple="{ class: 'neutral--text', center: true }"
                    :src="recording.poster"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                    height="100%"
                    width="100%"
                    style="position: absolute"
                  >
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        />
                      </v-row>
                    </template>
                  </v-img>
                </transition>
              </div>
            </v-responsive>
            <v-responsive v-else :aspect-ratio="16 / 9" class="mb-6">
              <v-btn height="100%" width="100%"> Upload Poster </v-btn>
            </v-responsive>
            <v-text-field
              v-model.lazy="recording.poster"
              :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
              label="Poster URL"
              outlined
              dense
              @change="autoSave()"
            />
            <v-text-field
              v-model.lazy="recording.preview"
              :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
              label="Preview URL"
              outlined
              dense
              @change="autoSave()"
            />
            <v-text-field
              v-model.lazy="recording.common_name"
              :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
              label="Comman Name (used in URLs)"
              outlined
              dense
              @change="autoSave()"
            />
            <v-text-field
              v-model="recording.created_at"
              :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
              type="datetime-local"
              label="Created At"
              outlined
              dense
              hide-details
              @change="autoSave()"
            />
            <v-checkbox
              v-model.lazy="recording.listed"
              color="success"
              label="Listed"
              hide-details
              @change="autoSave()"
            />
            <v-checkbox
              v-model.lazy="recording.public"
              color="success"
              label="Published"
              hide-details
              @change="autoSave()"
            />
          </v-form>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="2">
        <v-card-text>
          <v-form class="pa-0" @submit="save()">
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
                    <v-icon left v-bind="attrs" v-on="on"> mdi-plus </v-icon>
                  </template>
                  <v-card width="100%">
                    <v-list class="pt-4">
                      <v-list-item>
                        <v-text-field
                          v-model="newLang"
                          :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                          label="Language (short)"
                          dense
                          outlined
                          :rules="[rules.notExist]"
                        />
                      </v-list-item>
                    </v-list>
                    <v-card-actions class="pt-0">
                      <v-spacer />
                      <v-btn text @click="showAddLang = false"> Close </v-btn>
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
            outlined
            dense
            @change="autoSave()"
          />
          <v-autocomplete
            v-model="recording.events"
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
            v-model="recording.speakers"
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
    <v-divider />
    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
      <v-spacer />
      <v-btn text @click="close()"> Close </v-btn>
      <v-btn v-if="step !== 3" color="primary" depressed @click="step++">
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
  props: ["channelid", "recordingid", "createdData", "lang"],
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
      savedRecData: {},
      savedLangs: {},
      savedCurrentLang: {},
      selectedLang: this.lang,
      showAddLang: false,
      showPreview: false,
      speakers: [],
      step: 1,
      recording: {},
      formDefault: {
        poster:
          "https://cdn.media.kukoon.de/videos/" +
          this.channelid +
          "/" +
          this.recordingid +
          "/poster.jpg",
        preview:
          "https://cdn.media.kukoon.de/videos/" +
          this.channelid +
          "/" +
          this.recordingid +
          "/preview.webp",
      },
      tags: [],
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
    currentTitle() {
      switch (this.step) {
        default:
          return "Settings";
        case 2:
          return "Title and Description";
        case 3:
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
        Object.keys(this.savedRecData).length !== 0 &&
        Object.keys(this.langForm).length !== 0
      ) {
        langsEqual = this.shallowEqual(this.savedCurrentLang, this.langForm);
      } else {
        langsEqual = true;
      }
      return this.shallowEqual(this.recording, this.savedRecData) && langsEqual;
    },
  },
  watch: {
    recordingid() {
      this.loadFilterData();
      this.loadLangs();
      this.load();
    },
  },
  mounted() {
    this.loadFilterData();
    this.loadLangs();
    if (this.selectedLang) {
      this.step = 2;
    }
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
        resp = api.Recordings.Langs.Add(this.recordingid, langForm);
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
      this.$emit("loadRecordings");
      this.$emit("closeDialog");
      this.step = 1;
    },
    reset() {
      this.recording = Object.assign({}, this.formDefault);
    },
    load() {
      if (!this.recordingid) {
        this.reset();
        this.savedRecData = { ...this.recording };
        return;
      }
      api.Recordings.Get(this.recordingid).then((response) => {
        this.recording = models.Recording.FromRequest(response.data);
        this.savedRecData = { ...this.recording };
        this.loaded = true;
      });
    },
    loadFilterData() {
      api.Tags.List().then((response) => (this.tags = response.data));
      api.Events.List().then((response) => (this.events = response.data));
      api.Speakers.List().then((response) => (this.speakers = response.data));
    },
    loadLangs(newLang) {
      api.Recordings.Langs.List(this.recordingid).then((response) => {
        this.langs = response.data;
        if (newLang) {
          this.selectedLang = newLang;
        } else if (
          !this.selectedLang &&
          this.langAbbrs.includes(this.$store.getters.language)
        ) {
          this.selectedLang = this.$store.getters.language;
        } else if (!this.selectedLang && this.langAbbrs.length === 0) {
          this.selectedLang = this.$store.getters.language;
          console.log(this.selectedLang);
          this.newLang = this.selectedLang;
          this.addLang();
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
      api.Recordings.Delete(this.recordingid).then(() => {
        this.close();
        this.reset();
        this.$emit("loadRecordings");
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
      const data = models.Recording.ToRequest(this.recording);
      if (this.recordingid) {
        resp = api.Recordings.Save(this.recordingid, data);
      } else {
        resp = api.Recordings.Add(data);
      }
      resp.then((response) => {
        this.recording = models.Recording.FromRequest(response.data);

        for (const lang of this.langs) {
          if (lang.id) {
            resp = api.Recordings.Langs.Save(lang.id, lang);
          }
          resp.then(() => {
            this.loadLangs();
          });
        }
        if (this.langs.length === 0) {
          this.loading = false;
        }
        this.$emit("loadRecordings");
        if (!this.keepOpen) {
          this.close();
        }
        this.keepOpen = false;
        this.savedRecData = { ...this.recording };
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
