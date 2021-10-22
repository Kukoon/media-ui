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
          <h3>Events</h3>
          <v-spacer></v-spacer>
          <v-btn icon small @click="showDialog = true">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </v-row>
        <v-simple-table dense class="mt-2">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Logo</th>
                <th class="text-left">Name</th>
                <th class="text-left">Website</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" :key="item.id">
                <td>
                  <v-avatar v-if="item.logo" size="24px">
                    <img :src="item.logo" />
                  </v-avatar>
                </td>
                <td>{{ item.name }}</td>
                <td>
                  <a v-if="item.url" :href="item.url" target="_blank">{{
                    item.url
                  }}</a>
                </td>
                <td>
                  <v-btn
                    icon
                    small
                    @click="
                      showDialog = true;
                      formData = item;
                    "
                  >
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click="
                      confirmRemove = true;
                      removeID = item.id;
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-btn class="mt-4" color="sucess" @click="showDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add Event
        </v-btn>
        <v-dialog v-model="showDialog" width="540">
          <v-card
            rounded
            elevation="0"
            :color="darkMode ? 'grey darken-4' : 'grey lighten-5'"
          >
            <v-card-title v-if="formData.id">Edit</v-card-title>
            <v-card-title v-else>New Event</v-card-title>
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
                  v-model="formData.logo"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Logo"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="formData.url"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="URL"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-textarea
                  v-model="formData.description"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Description"
                  required
                  outlined
                  dense
                ></v-textarea>
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
  name: "ChannelEvents",
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
    load() {
      api.Events.ListChannelMy(this.channelid)
        .then((resp) => (this.list = resp.data))
        .catch(() => {
          this.list = [];
        });
    },
    save() {
      let resp = null;
      if (this.formData.id) {
        resp = api.Events.Save(this.formData.id, this.formData);
      } else {
        resp = api.Events.Add(this.channelid, this.formData);
      }
      resp.then(() => {
        this.formData = Object.assign({}, this.formDefault);
        this.load();
      });
      this.showDialog = false;
    },
    remove(id) {
      api.Events.Delete(id).then(this.load);
      this.removeID = null;
      this.confirmRemove = false;
    },
    clear() {
      this.formData = Object.assign({}, this.formDefault);
      this.showDialog = false;
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