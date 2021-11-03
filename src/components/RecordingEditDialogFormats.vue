<template>
  <v-card-text class="pt-0">
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
        <v-col class="grow"> Do you really want to remove this format? </v-col>
        <v-col class="shrink">
          <v-btn elevation="0" @click="remove()"> Remove </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-data-table
      :class="darkMode ? 'neutral lighten-3' : ''"
      :items="formats"
      :headers="headers"
      calculate-widths
      disable-sort
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.lang="props">
        <v-edit-dialog :return-value.sync="props.item.lang">
          {{ props.item.lang.toUpperCase() }}
          <template v-slot:input>
            <div class="mt-4">Update Language (short):</div>
            <v-text-field
              v-model="props.item.lang"
              label="Edit"
              single-line
              @change="autoSave()"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.quality="props">
        <v-edit-dialog
          :return-value.sync="props.item.quality"
          large
          persistent
          @close="autoSave()"
          @save="autoSave()"
        >
          {{ props.item.quality }}
          <template v-slot:input>
            <v-select
              v-model="select"
              :items="qualities"
              item-text="text"
              item-value="value"
              return-object
              single-line
              @input="
                props.item.quality = `${select.value}`;
                toggle = false;
              "
            ></v-select>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.bytes="props">
        <v-edit-dialog :return-value.sync="props.item.bytes">
          {{ formatBytes(props.item.bytes) }}
          <template v-slot:input>
            <div class="mt-4">Update Size (in bytes):</div>
            <v-text-field
              v-model="props.item.bytes"
              label="Edit"
              single-line
              @change="autoSave()"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.resolution="props">
        <v-edit-dialog :return-value.sync="props.item.resolution">
          {{ props.item.resolution }}
          <template v-slot:input>
            <div class="mt-4">Update Resolution:</div>
            <v-text-field
              v-model="props.item.resolution"
              label="Edit"
              single-line
              @change="autoSave()"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.url="props">
        <v-edit-dialog :return-value.sync="props.item.url">
          {{ shortenURL(props.item.url) }}
          <template v-slot:input>
            <div class="mt-4">Update File (URL):</div>
            <v-text-field
              v-model="props.item.url"
              label="Edit"
              single-line
              @change="autoSave()"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template #item.is_video="{ item }">
        <v-checkbox v-model="item.is_video" @change="autoSave()"></v-checkbox>
      </template>
      <template #item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="
            removeID = item.id;
            confirmRemove = true;
          "
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-btn color="info" class="mt-4" @click="addFormat()">
      <v-icon small left> mdi-plus </v-icon>
      Add Format
    </v-btn>
  </v-card-text>
</template>

<script>
import { mapGetters } from "vuex";
import { api } from "@/services/api.js";

export default {
  name: "RecordingEditDialogFormats",
  props: ["channelid", "recordingid", "formats"],
  data() {
    return {
      confirmRemove: false,
      formatForm: {
        lang: this.$store.getters.language,
        url:
          "https://cdn.media.kukoon.de/videos/" +
          this.channelid +
          "/" +
          this.recordingid +
          "/video_best.mp4",
        resolution: "1920x1080",
        quality: 0,
        bytes: 0,
        is_video: true,
      },
      headers: [
        { text: "Lang", value: "lang" },
        { text: "Quality", value: "quality" },
        { text: "Size", value: "bytes" },
        { text: "Resolution", value: "resolution" },
        { text: "File", value: "url" },
        { text: "Video", value: "is_video" },
        { text: "Actions", value: "actions" },
      ],
      qualities: [
        { text: "Origin", value: 0 },
        { text: "4k", value: 100 },
        { text: "1440p", value: 140 },
        { text: "1080p", value: 150 },
        { text: "720p", value: 160 },
        { text: "480p", value: 180 },
        { text: "360p", value: 200 },
        { text: "240p", value: 250 },
        { text: "144p", value: 300 },
      ],
      removeID: null,
      select: "",
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    addFormat() {
      let resp = null;
      resp = api.Recordings.Formats.Add(this.recordingid, this.formatForm);
      resp.then(() => {
        this.$emit("change-recording");
        //this.$emit("loadRecordings");
      });
    },
    autoSave() {
      setTimeout(() => {
        this.save();
      }, 500);
    },
    save() {
      let resp = null;
      this.$emit("toggle-loading");
      for (let [i, format] of this.formats.entries()) {
        format.quality = parseInt(format.quality);
        format.bytes = parseInt(format.bytes);
        resp = api.Recordings.Formats.Save(format.id, format);
        resp.then(() => {
          if (i === this.formats.length - 1) {
            //this.$emit("loadRecordings");
            this.$emit("toggle-loading");
          }
        });
      }
    },
    remove() {
      this.$emit("toggle-loading");
      api.Recordings.Formats.Delete(this.removeID).then(() => {
        this.$emit("change-recording");
        this.$emit("toggle-loading");
        //this.$emit("loadRecordings");
        this.confirmRemove = false;
      });
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    shortenURL(string) {
      const n = string.lastIndexOf("/");
      return string.substring(n + 1);
    },
  },
};
</script>