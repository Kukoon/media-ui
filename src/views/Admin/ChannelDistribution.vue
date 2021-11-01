<template>
  <v-container fluid>
    <v-snackbar
      v-model="confirmRemove"
      app
      top
      max-width="100%"
      transition="scroll-y-transition"
    >
      <v-alert
        id="alert"
        v-model="confirmRemove"
        type="error"
        dismissible
        dense
        icon="mdi-alert"
        class="mb-0"
      >
        <v-row align="center">
          <v-col class="grow">
            Do you really want to remove this Event? This action cannot be
            undone.
          </v-col>
          <v-col class="shrink">
            <v-btn small outlined @click="deleteRestream(removeID)">
              Remove
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-snackbar>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3>Distribution</h3>
          <v-btn icon small @click.stop="info = !info">
            <v-icon small> mdi-help-circle </v-icon>
          </v-btn>
          <v-spacer />
          <v-btn icon small @click="add()">
            <v-icon small> mdi-plus </v-icon>
          </v-btn>
        </v-row>
        <v-alert
          v-show="info"
          dense
          text
          icon="mdi-help-circle"
          type="info"
          border="left"
          class="mt-2"
        >
          In the <strong>distribution</strong> menu, the user can add and remove
          distribution channels or restreams.
        </v-alert>
        <v-simple-table dense class="mt-2">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Protocol</th>
                <th class="text-left">URL</th>
                <th class="text-left">State</th>
                <th class="text-left">Count</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in restreams" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.protocol }}</td>
                <td>{{ item.url }}</td>
                <td>{{ item.state }}<br /></td>
                <td>{{ item.sequence }}</td>
                <td>
                  <v-btn icon small @click="edit(item)">
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click="
                      removeID = item.id;
                      confirmRemove = true;
                    "
                  >
                    <v-icon small> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-btn class="mt-4" color="success" @click="add()">
          <v-icon left> mdi-plus </v-icon>
          Add Re-Stream
        </v-btn>
        <v-dialog v-model="showDialog" width="540">
          <v-card
            rounded
            elevation="1"
            :color="darkMode ? 'grey darken-4' : 'grey lighten-5'"
          >
            <v-card-title v-if="formData.id"> Edit </v-card-title>
            <v-card-title v-else> New Re-Stream </v-card-title>
            <v-card-text class="pb-0">
              <v-form class="pa-0 mt-2" @submit="addRestream()">
                <v-text-field
                  v-model="formData.name"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Name"
                  required
                  outlined
                  dense
                />
                <v-text-field
                  v-model="formData.protocol"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Protocol"
                  required
                  outlined
                  dense
                />
                <v-text-field
                  v-model="formData.url"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="URL"
                  required
                  outlined
                  dense
                />
                <v-text-field
                  v-model="formData.secret"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                  label="Secret"
                  required
                  outlined
                  dense
                />
                <!-- TODO: Add 'active' field to API -->
                <!-- <v-switch v-model="formData.active"></v-switch> -->
              </v-form>
            </v-card-text>
            <v-card-actions class="px-6 pb-4">
              <v-btn text class="ml-auto" @click="showDialog = false">
                Cancel
              </v-btn>
              <v-btn color="success" @click="save()"> Save </v-btn>
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
  name: "Restream",
  props: ["channelid"],
  data() {
    return {
      confirmRemove: false,
      info: false,
      removeID: null,
      restreams: [],
      formDefault: {
        protocol: "rtmp",
        url: "rtmp://a.rtmp.youtube.com/live2",
      },
      formData: {},
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    channelid() {
      this.formData = Object.assign({}, this.formDefault);
      this.loadRestream();
    },
  },
  created() {
    this.formData = Object.assign({}, this.formDefault);
    this.loadRestream();
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
    loadRestream() {
      api.Channels.Restreams.List(this.channelid)
        .then((resp) => (this.restreams = resp.data))
        .catch(() => {
          this.restreams = [];
        });
    },
    addRestream() {
      api.Channels.Restreams.Add(this.channelid, this.formData).then(() => {
        this.formData = Object.assign({}, this.formDefault);
        this.loadRestream();
      });
      this.showDialog = false;
    },
    deleteRestream(id) {
      api.Channels.Restreams.Delete(this.channelid, id).then(() => {
        this.loadRestream();
        this.confirmRemove = false;
      });
    },
  },
};
</script>

<style scoped>
#alert {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.v-snack >>> .v-snack__content {
  padding: 0 !important;
}
.v-snack >>> .v-snack__wrapper {
  display: block;
  margin: 0;
  width: 60% !important;
  min-height: unset !important;
}
</style>
