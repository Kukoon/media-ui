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
      <v-card-title v-if="form.id"> Edit </v-card-title>
      <v-card-title v-else> New Event </v-card-title>
      <v-card-text class="pb-0">
        <v-form class="mt-2" @submit="save()">
          <v-text-field
            v-model="form.name"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Name"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="form.logo"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Logo"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="form.url"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Website URL"
            required
            outlined
            dense
          />
          <v-textarea
            v-model="form.description"
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Description"
            required
            outlined
            dense
          />
        </v-form>
      </v-card-text>
      <v-divider />

      <v-card-actions class="neutral lighten-1">
        <v-btn text class="ml-auto" @click="close()"> Cancel </v-btn>
        <v-btn text color="success" @click="save()"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "EventEditDialog",
  props: ["channelid", "formData"],
  data() {
    return {
      dialog: true,
      formOnCreated: {},
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
    form: {
      get() {
        return this.formData ? this.formData : {};
      },
    },
  },
  created() {
    this.formOnCreated = this.formData ? { ...this.form } : {};
  },
  methods: {
    close(id) {
      this.$emit("closeEventEditDialog", false, id);
    },
    save() {
      let resp = null;
      if (this.form.id) {
        resp = api.Events.Save(this.form.id, this.form);
      } else {
        resp = api.Events.Add(this.channelid, this.form);
      }
      resp.then((resp) => {
        this.close(resp.data.id);
      });
    },
  },
};
</script>