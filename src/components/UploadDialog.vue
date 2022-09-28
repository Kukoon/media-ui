<template>
  <v-dialog
    width="300"
    hide-overlay
    content-class="elevation-10"
    v-model="dialog"
    @input="close()"
  >
    <v-card
      outlined
      tile
      elevation="0"
      :color="darkMode ? 'grey darken-4' : 'grey lighten-5'"
    >
      <v-card-title> Upload </v-card-title>
      <v-card-text class="pb-0">
        <v-form class="mt-2" @submit="upload()">
          <v-file-input
            v-model="fileSrc"
            truncate-length="15"
            outlined
            dense
            label="File input"
            :error-messages="errorMessage"
          ></v-file-input>
        </v-form>
        <v-progress-linear
          :value="uploadProgress"
          v-if="uploadProgress > 0"
        ></v-progress-linear>
      </v-card-text>
      <v-divider />

      <v-card-actions class="neutral lighten-1">
        <v-btn text class="ml-auto" @click="close()"> Cancel </v-btn>
        <v-btn text color="success" @click="upload()"> Upload </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { api } from "@/services/api.js";

export default {
  name: "UploadDialog",
  computed: {
    ...mapGetters(["darkMode"]),
  },
  props: ["channelid"],
  data() {
    return {
      dialog: true,
      fileSrc: {},
      uploadProgress: 0,
      errorMessage: null,
    };
  },
  methods: {
    close() {
      this.$emit("closeUploadDialog", false);
    },
    upload() {
      console.log("upload");
      this.errorMessage = null;
      api.Channels.LogoUploader(
        this.channelid,
        this.fileSrc,
        () => console.log("success"),
        (percent) => {
          console.log(percent, "%");
          this.uploadProgress = percent;
        },
        (error) => {
          this.errorMessage = error.message
            .split(", caused by")[0]
            .split(", originated from request")[0];
          console.error(this.errorMessage);
        }
      );
    },
  },
};
</script>
