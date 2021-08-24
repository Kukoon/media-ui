<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Channel</h3>
        <v-divider class="mt-2"></v-divider>
        <v-form class="pa-0 mt-2" @submit="save()">
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Title"
            v-model="channel.title"
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Comman Name (used for nice and short urls)"
            v-model="channel.common_name"
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Logo (URL to an logo)"
            v-model="channel.logo"
          ></v-text-field>
          <v-btn class="ml-auto" color="green" @click="save()"> Save </v-btn>
          <v-badge overlap color="grey" content="dev">
            <v-btn disabled outlined color="error darken-1"> Delete </v-btn>
          </v-badge>
        </v-form>
        <v-divider class="mt-4 mb-4"/>
        <h4>Stream Ingress</h4>
        <v-simple-table dense>
          <template v-slot:default>
           <thead>
             <tr>
                <th class="text-left">
                  Description
                </th>
                <th class="text-left">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RTMP Complete Link</td>
                <td><code>{{ ingressRTMP.replace("{ID}", channel.id) }}</code></td>
              </tr>
              <tr>
                <td>
                  or <br/>
                  RTMP URL
                </td>
                <td><code>{{ ingressRTMP.replace("{ID}","") }}</code></td>
              </tr>
              <tr>
                <td>Secret</td>
                <td><code>{{ channel.id }}</code></td>
              </tr>
              <tr>
               <td>
                  or <br/>
                  Stream from Browser, by using this WebRTC-URL in Input like
                  <a href="https://demo.ovenplayer.com/demo_input.html" target="_blank">
                    OvenPlayer Demo Input
                  </a>
                </td>
                <td>
                 <code>{{ ingressWS.replace("{ID}", channel.id) }}</code>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import { config } from "../../../config.js"; // ingressURLs

export default {
  name: "ChannelEdit",
  props: ["channelid"],
  data() {
    return {
      ingressRTMP: config.ingressURL.rtmp,
      ingressWS: config.ingressURL.ws,
      channel: {},
    }
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    save() {
      api
        .SaveChannel(this.channelid, this.channel)
        .then((response) => {
          this.channel = response.data;
          this.$emit('change-channel');
        });
    },
    load() {
      api
        .GetChannel(this.channelid)
        .then((response) => (this.channel = response.data));
    },
  },
  watch: {
    channelid() {
      this.load()
   },
  },
  created() {this.load()},
};
</script>
