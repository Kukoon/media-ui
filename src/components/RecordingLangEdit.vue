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
          Do you really want to remove this recording? This action cannot be
          undone.
        </v-col>
        <v-col class="shrink">
          <v-btn outlined @click="remove()"> Remove </v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <v-form class="pa-0 mt-2" @submit="save()">
      <v-text-field
        v-model="langForm.lang"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Language (short)"
        minlength="2"
        maxlength="2"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-text-field
        v-model="langForm.title"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Title"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-text-field
        v-model.lazy="langForm.subtitle"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Subtitle"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-textarea
        v-model.lazy="langForm.short"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Short Description"
        outlined
        dense
        @input="enableSave = true"
      />
      <v-textarea
        v-model.lazy="langForm.long"
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Description"
        outlined
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
        v-if="lang.id"
        class="ml-1"
        color="error"
        @click="confirmRemove = true"
      >
        <v-icon left> mdi-delete </v-icon>
        Delete
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "RecordingLangEdit",
  props: {
    recordingid: {
      type: String,
    },
    lang: {
      type: Object,
      default() {
        return {
          lang: this.$store.getters.language,
        };
      },
    },
  },
  data() {
    return {
      langForm: {},
      enableSave: false,
      confirmRemove: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  mounted() {
    this.langForm = Object.assign({}, this.lang);
  },
  methods: {
    save() {
      let resp = null;
      if (this.lang.id) {
        resp = api.Recordings.Langs.Save(this.lang.id, this.langForm);
      } else {
        resp = api.Recordings.Langs.Add(this.recordingid, this.langForm);
      }
      resp.then(() => {
        // this.lang = response.data;
        this.$emit("change-recording");
      });
    },
    remove() {
      api.Recordings.Langs.Delete(this.lang.id).then(() => {
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
