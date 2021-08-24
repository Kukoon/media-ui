<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>ReStream / Push</h3>
        <v-simple-table dense class="mt-2">
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
        <h4 class="mt-4">New Restream</h4>
        <v-form>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="restreamForm.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-col> 
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="restreamForm.protocol"
                  label="Protocol"
                  required
                ></v-text-field>
              </v-col> 
              <v-col
                cols="12"
                md="8"
              >
                <v-text-field
                  v-model="restreamForm.url"
                  label="URL"
                  required
                ></v-text-field>
              </v-col> 
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="restreamForm.secret"
                  label="Secret"
                  required
                ></v-text-field>
                <v-btn class="ml-auto" color="green" @click="addRestream"> Add </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form> 
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
       restreams: [],
       restreamFormDefault: {
         protocol: "rtmp",
         url: "rtmp://a.rtmp.youtube.com/live2",
       },
       restreamForm: {},
     }
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    loadRestream() {
      api.ListRestreams(this.channelid).then(resp => this.restreams = resp.data).catch(()=>{ this.restreams = []})
    },
    addRestream() {
      api.RestreamAdd(this.channelid, this.restreamForm).then(()=> {
        this.restreamForm = Object.assign({}, this.restreamFormDefault)
        this.loadRestream()
      })
    },
    deleteRestream(id) {
      api.RestreamDelete(this.channelid, id).then(this.loadRestream)
    },
  },
  watch: {
    channelid() {
      this.restreamForm = Object.assign({}, this.restreamFormDefault)
      this.loadRestream();
    },
  },
  created() {
    this.restreamForm = Object.assign({}, this.restreamFormDefault)
    this.loadRestream()
  },
};
</script>
