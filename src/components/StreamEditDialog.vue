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
            <v-card-text v-if="!stream.common_name">
              <v-card :color="darkMode ? 'neutral lighten-2' : 'white'" flat>
                <v-card-text class="d-flex justify-center">
                  <VideographerDrawing :color="streamColor" width="240" />
                </v-card-text>
                <v-card-title class="d-flex justify-center mt-0 pt-0">
                  No Stream Identifier
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center">
                  Please add a machine readable identifier for the stream
                </v-card-subtitle>
                <v-card-actions class="d-flex justify-center">
                  <v-btn color="info" @click="showAddCommonName = true">
                    Add Identifier
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>
            <v-card-text v-else>
              <v-form class="pa-0 mt-2" :disabled="!loaded" @submit="save()">
                <v-row no-gutters>
                  <v-text-field
                    v-model.lazy="stream.common_name"
                    class="flex-grow-1"
                    :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                    label="Identifier (used in URLs)"
                    outlined
                    dense
                    readonly
                    @change="autoSave()"
                  >
                    <template v-slot:append-outer>
                      <v-btn
                        icon
                        @click="showAddCommonName = true"
                        small
                        :disabled="false"
                      >
                        <v-icon small> mdi-pencil </v-icon></v-btn
                      >
                    </template>
                  </v-text-field>
                </v-row>
                <v-dialog
                  ref="dialog"
                  v-model="showListenAtDialog"
                  :return-value="stream.listen_at"
                  width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      label="Created"
                      outlined
                      dense
                      readonly
                      @change="autoSave()"
                      v-bind="attrs"
                      v-on="on"
                      :value="readableDate(stream.listen_at)"
                    />
                  </template>
                  <v-tabs
                    v-model="dateTabs"
                    fixed-tabs
                    background-color="primary darken-2"
                  >
                    <v-tab> Date </v-tab>
                    <v-tab> Time </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="dateTabs">
                    <v-tab-reverse-transition>
                      <v-tab-item>
                        <v-date-picker
                          v-model="listenAtDate"
                          scrollable
                          color="primary"
                        >
                        </v-date-picker>
                      </v-tab-item>
                    </v-tab-reverse-transition>
                    <v-tab-reverse-transition>
                      <v-tab-item>
                        <v-time-picker
                          v-model="listenAtTime"
                          scrollable
                          format="24hr"
                          color="primary"
                        >
                        </v-time-picker>
                      </v-tab-item>
                    </v-tab-reverse-transition>
                  </v-tabs-items>
                  <v-divider />
                  <v-card-actions class="neutral lighten-1">
                    <v-spacer />
                    <v-btn text @click="showListenAtDialog = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="success"
                      @click="
                        {
                          autoSave();
                          showListenAtDialog = false;
                        }
                      "
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-dialog>
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
            <v-dialog v-model="showAddCommonName" width="300" hide-overlay>
              <v-card flat :color="darkMode ? 'neutral lighten-1' : 'white'">
                <v-card-title>
                  {{
                    !this.stream.common_name
                      ? "Add Stream Identifier"
                      : "Save Stream Identifier"
                  }}
                </v-card-title>
                <v-card-subtitle
                  >We need a machine readable identifier
                </v-card-subtitle>
                <v-card-text>
                  <v-form
                    class="pa-0 mt-2"
                    :disabled="!loaded"
                    @submit.prevent="addCommonName()"
                  >
                    <v-text-field
                      v-model.lazy="commonName"
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      label="Identifier (used in URLs)"
                      outlined
                      dense
                  /></v-form>
                </v-card-text>
                <v-divider />
                <v-card-actions class="neutral lighten-1">
                  <v-spacer />
                  <v-btn text @click="showAddCommonName = false"> Close </v-btn>
                  <v-btn
                    color="success"
                    text
                    :disabled="!cName"
                    @click="addCommonName()"
                  >
                    {{ !this.stream.common_name ? "Add" : "Save" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text v-if="!selectedLang && langs.length === 0">
              <v-card :color="darkMode ? 'neutral lighten-2' : 'white'" flat>
                <v-card-text class="d-flex justify-center">
                  <LanguageSimpleDrawing
                    :color="streamColor"
                    width="240"
                    v-if="!loading"
                  />
                </v-card-text>
                <v-card-title class="d-flex justify-center mt-0 pt-0">
                  No Language
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center">
                  Please add some language to the stream's description
                </v-card-subtitle>
                <v-card-actions class="d-flex justify-center">
                  <v-btn color="info" @click="showAddLang = true">
                    Add Language
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>
            <v-card-text v-else>
              <v-form class="pa-0 mt-2" @submit.prevent="save()">
                <v-autocomplete
                  v-model="selectedLang"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Language"
                  :items="langAbbrs"
                  item-text="name"
                  item-value="abbr"
                  auto-select-first
                  minlength="2"
                  maxlength="2"
                  outlined
                  dense
                  @input="updateLangForm()"
                >
                  <template #append-outer>
                    <v-btn icon @click="showAddLang = true" class="mt-n1">
                      <v-icon> mdi-plus </v-icon>
                    </v-btn>
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
            <v-dialog
              v-model="showAddLang"
              width="300"
              hide-overlay
              content-class="elevation-10"
            >
              <v-card flat :color="darkMode ? 'neutral lighten-1' : 'white'">
                <v-card-title> Add Language </v-card-title>
                <v-card-subtitle>
                  We store languages in short codes
                </v-card-subtitle>
                <v-card-text>
                  <v-autocomplete
                    :items="codes.all()"
                    item-text="name"
                    item-value="1"
                    v-model="newLang"
                    label="Language"
                    outlined
                    dense
                    :rules="[rules.notExist]"
                    :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                    class="pr-2"
                  ></v-autocomplete>
                </v-card-text>
                <v-divider />

                <v-card-actions class="neutral lighten-1">
                  <v-spacer />
                  <v-btn text @click="showAddLang = false"> Close </v-btn>
                  <v-btn
                    color="success"
                    text
                    :disabled="!newLang || this.langsContainNew"
                    @click="addLang()"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-window-item>
          <v-window-item :value="3">
            <v-card-text v-if="!stream.poster">
              <v-card :color="darkMode ? 'neutral lighten-2' : 'white'" flat>
                <v-card-text class="d-flex justify-center">
                  <ImageUploadDrawing :color="streamColor" width="240" />
                </v-card-text>
                <v-card-title class="d-flex justify-center mt-0 pt-0">
                  Upload a Poster
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center">
                  Please add a poster to the stream
                </v-card-subtitle>
                <v-card-actions class="d-flex justify-center">
                  <v-btn color="info" @click="showAddCommonName = true">
                    Add Poster
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>
            <v-card-text v-else>
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
    <v-card-actions class="neutral lighten-1">
      <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
      <v-spacer />
      <v-btn text @click="close()"> Close </v-btn>
      <v-btn v-if="step !== 4" color="success" depressed @click="step++">
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
import { toIsoString } from "@/services/lib.js";
import { models } from "@/services/lib.js";

import codes from "langs";
import LanguageSimpleDrawing from "@/assets/LanguageSimpleDrawing.vue";
import VideographerDrawing from "@/assets/VideographerDrawing.vue";
import ImageUploadDrawing from "@/assets/ImageUploadDrawing.vue";

export default {
  name: "StreamEditDialog",
  components: {
    LanguageSimpleDrawing,
    VideographerDrawing,
    ImageUploadDrawing,
  },
  props: ["channelid", "streamid", "streamColor"],
  data() {
    return {
      codes: codes,
      cName: "",
      dateTabs: 0,
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
      showAddCommonName: false,
      showListenAtDialog: false,
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
    listenAtDate: {
      get() {
        const date = new Date(this.stream.listen_at).toISOString().slice(0, 10);
        return date;
      },
      set(v) {
        let time = new Date(v);
        time = toIsoString(time).slice(0, 16);
        this.stream.listen_at = time;
      },
    },
    listenAtTime: {
      get() {
        let time = new Date(this.stream.listen_at);
        time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        return time.toISOString().slice(11, 16);
      },
      set(v) {
        const dateTime = this.listenAtDate + "T" + v;
        this.stream.listen_at = dateTime;
      },
    },
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
    commonName: {
      get() {
        return this.stream.common_name;
      },
      set(v) {
        this.cName = v;
      },
    },
    langAbbrs() {
      const abbrs = [...new Set(this.langs.map((item) => item.lang))];
      let result = [];
      for (let abbr of abbrs) {
        const code = this.codes.where("1", abbr);
        result.push({ abbr: abbr, name: code.name });
      }
      return result;
    },
    langsContainNew() {
      return this.langs.some((e) => e.lang == this.newLang);
    },
    rules() {
      return {
        notExist: !this.langsContainNew || "Language already exists!",
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
    readableDate(s) {
      let date = new Date(s);
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const dateStr = date.toLocaleString([], options);
      return dateStr;
    },
    addCommonName() {
      this.keepOpen = true;
      this.stream.common_name = encodeURI(this.cName)
        .replace(/%20/g, "-")
        .toLowerCase();
      this.save();
      this.showAddCommonName = false;
    },
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
      this.loading = true;
      api.Streams.Langs.List(this.streamid).then((response) => {
        this.langs = response.data;
        if (newLang) {
          this.selectedLang = newLang;
        } else if (
          this.langAbbrs.filter((e) => {
            e.abbr === this.$store.getters.language;
          }).length > 0
        ) {
          this.selectedLang = this.$store.getters.language;
        } else if (this.langs.length > 0) {
          this.selectedLang = this.langs[0].lang;
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

<style lang="scss" scoped>
::v-deep .v-picker__title {
  max-height: 88px !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
::v-deep .theme--dark.v-picker__body {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background: var(--v-neutral-lighten2) !important;
}
::v-deep .theme--dark.v-time-picker-clock {
  background: var(--v-neutral-lighten3) !important;
}
</style>