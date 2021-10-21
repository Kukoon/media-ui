<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3>Distribution</h3>
          <v-spacer></v-spacer>
          <v-btn icon small @click.stop="info = !info">
            <v-icon small>mdi-help-circle</v-icon>
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
          <template v-slot:default>
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
                  <v-btn icon small @click="deleteRestream(item.id)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <h4 class="mt-4">New Restream</h4>
        <v-divider class="mt-2"></v-divider>
        <v-row no-gutters>
          <v-col>
            <v-form class="pa-0 mt-2" @submit="addRestream()">
              <v-text-field
                v-model="restreamForm.name"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Name"
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="restreamForm.protocol"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Protocol"
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="restreamForm.url"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="URL"
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="restreamForm.secret"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Secret"
                required
                outlined
                dense
              ></v-text-field>
              <v-btn class="ml-auto" color="sucess" @click="addRestream()">
                <v-icon left>mdi-plus</v-icon>
                Add
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
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
      info: false,
      restreams: [],
      restreamFormDefault: {
        protocol: "rtmp",
        url: "rtmp://a.rtmp.youtube.com/live2",
      },
      restreamForm: {},
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    loadRestream() {
      api.Channels.Restreams.List(this.channelid)
        .then((resp) => (this.restreams = resp.data))
        .catch(() => {
          this.restreams = [];
        });
    },
    addRestream() {
      api.Channels.Restreams.Add(this.channelid, this.restreamForm).then(() => {
        this.restreamForm = Object.assign({}, this.restreamFormDefault);
        this.loadRestream();
      });
    },
    deleteRestream(id) {
      api.Channels.Restreams.Delete(this.channelid, id).then(this.loadRestream);
    },
  },
  watch: {
    channelid() {
      this.restreamForm = Object.assign({}, this.restreamFormDefault);
      this.loadRestream();
    },
  },
  created() {
    this.restreamForm = Object.assign({}, this.restreamFormDefault);
    this.loadRestream();
  },
};
</script>
