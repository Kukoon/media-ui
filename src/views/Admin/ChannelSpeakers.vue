<template>
  <v-container fluid>
    <v-snackbar v-model="confirmRemove" app top max-width="100%" tile>
      <v-alert
        v-model="confirmRemove"
        id="alert"
        type="error"
        dismissible
        dense
        icon="mdi-alert"
        class="mb-0"
        tile
      >
        <v-row align="center">
          <v-col class="grow">
            Do you really want to remove this Event? This action cannot be
            undone.
          </v-col>
          <v-col class="shrink">
            <v-btn small outlined @click="remove(removeID)">Remove</v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-snackbar>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3>Speakers</h3>
          <v-spacer></v-spacer>
          <v-btn icon small @click="add()">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </v-row>
        <v-simple-table dense class="mt-2">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Organisation</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.organisation }}</td>
                <td>
                  <v-btn icon small @click="edit(item)">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click="
                      removeID = item.id;
                      confirmRemove = true;
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-btn class="mt-4" color="sucess" @click="add()">
          <v-icon left>mdi-plus</v-icon>
          Add Speaker
        </v-btn>
        <v-dialog v-model="showDialog" width="540">
          <v-card
            rounded
            elevation="1"
            :color="darkMode ? 'grey darken-4' : 'grey lighten-5'"
          >
            <v-card-title v-if="formData.id">Edit</v-card-title>
            <v-card-title v-else>New Speaker</v-card-title>
            <v-card-text class="pb-0">
              <v-form class="mt-2" @submit="save()">
                <v-text-field
                  v-model="formData.name"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Name"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="formData.organisation"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Organisation"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="px-6 pb-4">
              <v-btn outlined @click="showDialog = false"> Cancel </v-btn>
              <v-btn class="ml-auto" color="sucess" @click="save()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "ChannelSpeakers",
  props: ["channelid"],
  data() {
    return {
      confirmRemove: false,
      info: false,
      list: [],
      formDefault: {},
      formData: {},
      removeID: null,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    add() {
      this.formData = Object.assign({}, this.formDefault);

      this.showDialog = true;
    },
    edit(item) {
      this.showDialog = true;
      this.formData = item;
    },
    load() {
      api.Speakers.ListChannelMy(this.channelid)
        .then((resp) => (this.list = resp.data))
        .catch(() => {
          this.list = [];
        });
    },
    save() {
      let resp = null;
      if (this.formData.id) {
        resp = api.Speakers.Save(this.formData.id, this.formData);
      } else {
        resp = api.Speakers.Add(this.channelid, this.formData);
      }
      resp.then(() => {
        this.formData = Object.assign({}, this.formDefault);
        this.load();
      });
      this.showDialog = false;
    },
    remove(id) {
      api.Speakers.Delete(id).then(this.load);
      this.removeID = null;
      this.confirmRemove = false;
    },
    clear() {
      this.formData = Object.assign({}, this.formDefault);
    },
  },
  watch: {
    channelid() {
      this.formData = Object.assign({}, this.formDefault);
      this.load();
    },
  },
  created() {
    this.formData = Object.assign({}, this.formDefault);
    this.load();
  },
};
</script>


<style scoped>
.v-snack >>> .v-snack__content {
  padding: 0 !important;
}
.v-snack >>> .v-snack__wrapper {
  display: block;
  margin: 0;
  width: 100% !important;
  min-height: unset !important;
}
</style>