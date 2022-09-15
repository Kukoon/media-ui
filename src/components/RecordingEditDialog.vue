<template>
  <v-card width="100%" :color="darkMode ? 'neutral lighten-2' : 'white'">
    <v-row class="d-flex" no-gutters>
      <v-card width="8px" :color="getRecordingColor" tile />
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
            :disabled="Object.entries(savedRecData).length <= 0 || loading"
            :color="enableSave && !loading ? 'success' : 'error'"
            v-on="enableSave && !loading ? {} : { click: () => saveHandler() }"
            :title="enableSave && !loading ? null : 'Save unsaved changes'"
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
              <v-btn
                icon
                class="mr-auto"
                v-bind="attrs"
                v-on="on"
                title="Context menu"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list flat dense>
              <v-list-item-group>
                <v-list-item
                  :to="{
                    name: 'RecordingEdit',
                    params: {
                      channelid: channelid,
                      recordingid: recordingid,
                    },
                  }"
                >
                  <v-list-item-title>Edit </v-list-item-title>
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
            <v-card-text v-if="!recording.common_name">
              <v-card :color="darkMode ? 'neutral lighten-2' : 'white'" flat>
                <v-card-text class="d-flex justify-center">
                  <VideographerDrawing :color="getRecordingColor" width="240" />
                </v-card-text>
                <v-card-title class="d-flex justify-center mt-0 pt-0">
                  No Recording Identifier
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center">
                  Please add a machine readable identifier for the recording
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
                    v-model.lazy="recording.common_name"
                    class="flex-grow-1"
                    :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                    label="Identifier (used in URLs)"
                    outlined
                    dense
                    readonly
                    @change="saveHandler()"
                  >
                    <template v-slot:append-outer>
                      <v-btn
                        icon
                        title="Edit identifier"
                        @click="showAddCommonName = true"
                        small
                        :disabled="false"
                      >
                        <v-icon small> mdi-pencil </v-icon></v-btn
                      >
                    </template>
                  </v-text-field>
                </v-row>
                <v-text-field
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Created"
                  outlined
                  dense
                  readonly
                  @change="saveHandler()"
                  @click.stop="
                    dateTimePickerHandler({ created_at: recording.created_at })
                  "
                  :value="readableDate(recording.created_at)"
                />
                <DateTimePicker
                  v-if="showDateTimePicker"
                  :recording="recording"
                  :dateTimeObj="dateTimeObj"
                  @changeDate="changeDate($event)"
                  @changeTime="changeTime($event)"
                  @close="closeDateTimeHandler()"
                  @save="saveDateTimeHandler()"
                />
              </v-form>
            </v-card-text>
            <v-dialog v-model="showAddCommonName" width="300" hide-overlay>
              <v-card flat :color="darkMode ? 'neutral lighten-1' : 'white'">
                <v-card-title>
                  {{
                    !this.recording.common_name
                      ? "Add Recording Identifier"
                      : "Save Recording Identifier"
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
                    {{ !this.recording.common_name ? "Add" : "Save" }}
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
                    :color="getRecordingColor"
                    width="240"
                    v-if="!loading"
                  />
                </v-card-text>
                <v-card-title class="d-flex justify-center mt-0 pt-0">
                  No Language
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center">
                  Please add some language to the recording's description
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
                  @change="saveHandler()"
                />
                <v-text-field
                  v-model.lazy="langForm.subtitle"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Subtitle"
                  outlined
                  dense
                  @change="saveHandler()"
                />
                <v-textarea
                  v-model.lazy="langForm.short"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Short Description"
                  outlined
                  dense
                  height="70"
                  @change="saveHandler()"
                />
                <v-textarea
                  v-model.lazy="langForm.long"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  :disabled="!selectedLang"
                  label="Description"
                  outlined
                  dense
                  @change="saveHandler()"
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
            <v-card-text v-if="!recording.poster">
              <v-card :color="darkMode ? 'neutral lighten-2' : 'white'" flat>
                <v-card-text class="d-flex justify-center">
                  <ImageUploadDrawing :color="getRecordingColor" width="240" />
                </v-card-text>
                <v-card-title class="d-flex justify-center mt-0 pt-0">
                  Upload a Poster
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center">
                  Please add a poster to the recording
                </v-card-subtitle>
                <v-card-actions class="d-flex justify-center">
                  <v-btn color="info" @click="showAddPoster = true">
                    Add Poster
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>
            <v-card-text v-else>
              <v-responsive :aspect-ratio="16 / 9" class="mb-6">
                <v-img
                  v-if="recording.poster"
                  :aspect-ratio="16 / 9"
                  :src="recording.poster"
                  gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
                  height="100%"
                  width="100%"
                  style="border-radius: 4px"
                />
                <v-btn v-else height="100%" width="100%"> Upload Poster </v-btn>
              </v-responsive>
              <v-text-field
                v-model.lazy="recording.poster"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Poster URL"
                outlined
                dense
                @change="saveHandler()"
              />
            </v-card-text>
            <v-dialog v-model="showAddPoster" width="300" hide-overlay>
              <v-card flat :color="darkMode ? 'neutral lighten-1' : 'white'">
                <v-card-title>
                  {{ !this.recording.poster ? "Add Poster" : "Save Poster" }}
                </v-card-title>
                <v-card-subtitle
                  >Upload over command line and enter URL here
                </v-card-subtitle>
                <v-card-text>
                  <v-form
                    class="pa-0 mt-2"
                    :disabled="!loaded"
                    @submit.prevent="addPoster()"
                  >
                    <v-text-field
                      v-model.lazy="this.formDefault.poster"
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      label="Poster URL"
                      outlined
                      dense
                  /></v-form>
                </v-card-text>
                <v-divider />
                <v-card-actions class="neutral lighten-1">
                  <v-spacer />
                  <v-btn text @click="showAddPoster = false"> Close </v-btn>
                  <v-btn color="success" text @click="addPoster()">
                    {{ !this.recording.poster ? "Add" : "Save" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-window-item>
          <v-window-item :value="4">
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
                @change="saveHandler()"
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
                outlined
                dense
                @change="saveHandler()"
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
                @change="saveHandler()"
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
import { uuidToArrayElement, models } from "@/services/lib.js";

import { config } from "../../config.js";

import codes from "langs";
import DateTimePicker from "@/components/DateTimePicker.vue";
import ImageUploadDrawing from "@/assets/ImageUploadDrawing.vue";
import LanguageSimpleDrawing from "@/assets/LanguageSimpleDrawing.vue";
import VideographerDrawing from "@/assets/VideographerDrawing.vue";

export default {
  name: "RecordingEditDialog",
  components: {
    DateTimePicker,
    ImageUploadDrawing,
    LanguageSimpleDrawing,
    VideographerDrawing,
  },
  props: ["channelid", "recordingid"],
  data() {
    return {
      codes: codes,
      cName: "",
      dateTimeObj: {},
      events: [],
      keepOpen: false,
      langForm: {},
      langs: [],
      langExists: false,
      loaded: false,
      loading: false,
      newLang: "",
      savedDate: {},
      savedRecData: {},
      savedLangs: {},
      savedCurrentLang: {},
      selectedLang: null,
      selectedTextField: "",
      showAddLang: false,
      showAddCommonName: false,
      showAddPoster: false,
      showDateTimePicker: false,
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
    commonName: {
      get() {
        return this.recording.common_name;
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
        Object.keys(this.savedRecData).length !== 0 &&
        Object.keys(this.langForm).length !== 0
      ) {
        langsEqual = this.shallowEqual(this.savedCurrentLang, this.langForm);
      } else {
        langsEqual = true;
      }
      return this.shallowEqual(this.recording, this.savedRecData) && langsEqual;
    },
    getRecordingColor() {
      return uuidToArrayElement(this.recordingid, config.colors.calendar);
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
  },
  created() {
    this.load();
  },
  methods: {
    dateTimePickerHandler(obj) {
      let time = new Date(Object.values(obj)[0]);
      time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
      this.dateTimeObj = {
        date: new Date(Object.values(obj)[0]).toISOString().slice(0, 10),
        time: time.toISOString().slice(11, 16),
      };
      // make tmp copy to revert back to when canceled
      this.savedDate = {
        value: Object.values(obj)[0],
        key: Object.keys(obj)[0],
      };
      // if end_at, assign start_at to object passed to prevent earlier input
      if (this.savedDate.key === "end_at") {
        Object.assign(this.dateTimeObj, { min: this.recording.start_at });
      }
      this.showDateTimePicker = true;
    },
    changeDate(str) {
      // assign to object passed to DateTimePicker component
      this.dateTimeObj.date = str;
      // assign to recording object
      let date = new Date(str);
      date = toIsoString(date).slice(0, 16);
      this.recording[this.savedDate.key] = date;
    },
    changeTime(str) {
      // assign to object passed to DateTimePicker component
      this.dateTimeObj.time = str;
      // assign to recording object
      const dateTime =
        this.recording[this.savedDate.key].slice(0, 10) + "T" + str;
      this.recording[this.savedDate.key] = dateTime;
    },
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
      this.recording.common_name = encodeURI(this.cName)
        .replace(/%20/g, "-")
        .toLowerCase();
      this.save();
      this.showAddCommonName = false;
    },
    addPoster() {
      this.keepOpen = true;
      this.recording.poster = this.formDefault.poster;
      this.save();
      this.showAddPoster = false;
    },
    addLang() {
      let resp = null;
      const langForm = {
        lang: this.newLang,
      };
      if (!this.langAbbrs.some((e) => e.abbr === this.newLang)) {
        console.log(langForm);
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
      this.loading = true;
      api.Recordings.Langs.List(this.recordingid).then((response) => {
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
      api.Recordings.Delete(this.recordingid).then(() => {
        this.close();
        this.reset();
        this.$emit("loadRecordings");
      });
    },
    closeDateTimeHandler() {
      this.showDateTimePicker = false;
      this.recording[this.savedDate.key] = this.savedDate.value;
    },
    saveDateTimeHandler() {
      this.showDateTimePicker = false;
      this.saveHandler();
    },
    saveHandler() {
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