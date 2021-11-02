<template>
  <div>
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
          Do you really want to remove this recording format? This action cannot be
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

    <v-form
      class="pa-0 mt-2"
      @submit="save()"
    >
      <v-text-field
        v-model="formatForm.lang"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Language (short)"
        minlength="2"
        maxlength="2"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-text-field
        v-model="formatForm.url"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="URL"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-text-field
        v-model.lazy="formatForm.resolution"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Resolution"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-text-field
        v-model.lazy="formatForm.quality"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Quality (0: origin quality, 100: 4k, 140: 1440p, 150: 1080p, 160: 720p, 180: 480p. 200: 360p, 250: 240p, 300: 144p)"
        type="number"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-text-field
        v-model.lazy="formatForm.bytes"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Size (in Bytes)"
        type="number"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-switch
        v-model.lazy="formatForm.is_video"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Is Video?"
        class="pt-4 pb-4 ma-0"
        hide-details
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
        v-if="format.id"
        class="ml-1"
        color="error"
        @click="confirmRemove = true"
      >
        <v-icon left>
          mdi-delete
        </v-icon>
        Delete
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "RecordingEdit",
  props: {
    "recordingid": {
      type: String,
    },
    "channelid": {
      type: String,
    },
    "format": {
      type: Object,
      default() {
        return {
          lang: this.$store.getters.language,
          url: "https://cdn.media.kukoon.de/videos/"+this.channelid+"/"+this.recordingid+"/video_best.mp4",
          resolution: "1920x1080",
          quality: 0,
          bytes: 0,
          is_video: true,
        }
      },
    },
  },
  data() {
    return {
      formatForm: {},
      enableSave: false,
      confirmRemove: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  mounted() {
    this.formatForm = Object.assign({}, this.format);
  },
  methods: {
    save() {
      let resp = null;
      this.formatForm.quality = parseInt(this.formatForm.quality);
      this.formatForm.bytes = parseInt(this.formatForm.bytes);
      if (this.format.id) {
        resp = api.Recordings.Formats.Save(this.format.id, this.formatForm);
      } else {
        resp = api.Recordings.Formats.Add(this.recordingid, this.formatForm);
      }
      resp.then(() => {
        // this.format = response.data;
        this.$emit("change-recording");
      });
    },
    remove() {
      api.Recordings.Formats.Delete(this.format.id).then(() => {
        this.$emit("change-recording");
        this.confirmRemove = false;
      });
    },
    cancel() {
      this.confirmRemove = false;
    },
  },
};
</script>
