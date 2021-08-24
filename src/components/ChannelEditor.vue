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
      <v-badge overlap color="grey" content="dev">
        <v-btn disabled class="ml-auto" color="green lighten-3"> Save </v-btn>
      </v-badge>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { config } from "../../config.js"; // HLS ingressURLs

export default {
  name: "ChannelEditor",
  props: ["channel"],
  data() {
     return {
       ingressRTMP: config.ingressURL.rtmp,
       ingressWS: config.ingressURL.ws,
       form: {},
       data: this.channel,
     }
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    channel(to) {
      this.data = to;
    },
  },
};
</script>
