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
            outlined
            dense
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Comman Name (used for nice and short urls)"
            v-model="channel.common_name"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
            label="Logo URL"
            v-model="channel.logo"
            outlined
            dense
          ></v-text-field>
          <v-btn class="ml-auto mr-1" color="sucess" @click="save()">
            Save
          </v-btn>
          <v-btn class="ml-1" color="error darken-1" @click="remove()" v-if="channelid">
            Delete
          </v-btn>
        </v-form>
        <v-divider class="mt-4 mb-4" v-if="channelid" />
        <h4 v-if="channelid">Stream Ingress</h4>
        <v-simple-table dense v-if="channelid">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Description</th>
                <th class="text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RTMP Complete Link</td>
                <td>
                  <code>{{ ingressRTMP.replace("{ID}", channel.id) }}</code>
                </td>
              </tr>
              <tr>
                <td>RTMP URL</td>
                <td>
                  <code>{{ ingressRTMP.replace("{ID}", "") }}</code>
                </td>
              </tr>
              <tr>
                <td>Secret</td>
                <td>
                  <code>{{ channel.id }}</code>
                </td>
              </tr>
              <tr>
                <td>
                  Stream from Browser, by using this WebRTC-URL in Input like
                  <a
                    href="https://demo.ovenplayer.com/demo_input.html"
                    target="_blank"
                  >
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
      channelFormDefault: {
      },
    }
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    save() {
      let resp = null;
      if (this.channelid) {
       resp = api.Channels.Save(this.channelid, this.channel)
      } else {
        resp = api.Channels.Add(this.channel)
      }
      resp.then((response) => {
          this.channel = response.data;
          this.$emit('change-channel');
        });
    },
    remove() {
      api
        .Channels.Delete(this.channelid)
        .then(() => {
          this.$emit('change-channel');
          this.$router.replace({ name: "ChannelAdd" });
        });
    },
    load() {
      if (!this.channelid) {
         this.channel = Object.assign({}, this.channelFormDefault);
         return
      }
      api
        .Channels.Get(this.channelid)
        .then((response) => (this.channel = response.data));
    },
  },
  watch: {
    channelid() {
      this.load();
    },
  },
  created() {
    this.load();
  },
};
</script>
