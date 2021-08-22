<template>
  <div>
    <v-form ref="form" lazy-validation class="pa-0 mt-2">
      <v-text-field
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Title"
        v-model="data.title"
      ></v-text-field>
      <v-text-field
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Comman Name (used for nice and short urls)"
        v-model="data.common_name"
      ></v-text-field>
      <v-text-field
        :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
        label="Logo (URL to an logo)"
        v-model="data.logo"
      ></v-text-field>
      <v-badge overlap color="red" content="dev">
        <v-btn disabled class="ml-auto" color="primary lighten-3"> Save </v-btn>
      </v-badge>
      <v-badge overlap color="red" content="dev">
        <v-btn disabled outlined color="error darken-1"> Delete </v-btn>
      </v-badge>
    </v-form>
    <v-divider class="mt-4 mb-4"/>
    <h4>ReStream / Push</h4>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Protocol
            </th>
            <th class="text-left">
              URL
            </th>
            <th class="text-left">
              State
            </th>
            <th class="text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in restreams"
            :key="item.name"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.protocol }}</td>
            <td>{{ item.url }}</td>
            <td>
              Current: {{ item.state }}<br/>
              Used count:  {{ item.sequence }}
            </td>
            <td>
              <v-btn icon @click="deleteRestream(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>    
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "ChannelEditor",
  props: ["channel"],
  data() {
     return {
       form: {},
       data: this.channel,
       restreams: [],
       restreamForm: {},
     }
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    loadRestream() {
      api.ListRestreams(this.data.id).then(resp => this.restreams = resp.data).catch(()=>{ this.restreams = []})
    },
    addRestream() {
      api.RestreamAdd(this.data.id, this.restreamForm).then(this.loadRestream)
    },
    deleteRestream(id) {
      api.RestreamDelete(this.data.id, id).then(this.loadRestream)
    },
  },
  watch: {
    channel(to) {
      this.data = to;
      this.loadRestream();
    },
  },
  mounted() {
    this.loadRestream()
  },
};
</script>
