<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Channel</h3>
        <h4>Stream Ingress</h4>
        <v-simple-table dense>
          <template #default>
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
                  <code>{{ ingressRTMP }}</code>
                </td>
              </tr>
              <tr>
                <td>RTMP URL</td>
                <td>
                  <code>{{ ingressRTMP.slice(0, ingressRTMP.length -ingressRTMP.split("/").slice(-1)[0].length-1) }}</code>
                </td>
              </tr>
              <tr>
                <td>Secret</td>
                <td>
                  <code>{{ ingressRTMP.split("/").slice(-1)[0] }}</code>
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
                  <code>{{ ingressWS }}</code>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <v-chip
          v-if="video !== null && video.running"
          class="ma-2"
          text-color="white"
          color="red"
        >Live</v-chip>
        <v-chip
          v-else
          class="ma-2"
          text-color="white"
          color="purple"
        >Preview</v-chip>
        <VideoPlayerWrapper
          ref="player"
          :video="video"
          :sources="sources"
          :autostart="true"
          class="mx-n2"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-chip
          v-if="video === null || !video.chat"
          class="ma-2"
          color="purple"
          text-color="white"
        >Disabled</v-chip>
        <ChatBox class="ma-2" :room="video.channel.id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ChatBox from "@/components/ChatBox";
import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";

import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "AdminChannelLive",
  components: {
    ChatBox,
    VideoPlayerWrapper,
  },
  props: ["channelid"],
  data() {
    return {
      // Info Box
      ingressRTMP: "",
      ingressWS: "",
      // Stream
      sources: "",
      video: null,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    channelid() {
      this.init();
      this.load();
    },
  },
  created() {
    this.init();
    this.load();
  },
  methods: {
    init() {
      api.Channels.Get(this.channelid).then((resp) => {
        this.ingressRTMP = resp.data.ingress.rtmp;
        this.ingressWS = resp.data.ingress.webrtc;
        this.sources = resp.data.stream_sources;
        websocket.joinHandler(
          resp.data.data.id,
          "status",
          "live for status",
          (ev) => {
            this.$set(this.video, "viewers", ev.viewers);
            this.$set(this.video, "running", ev.running);
            if (ev.stream != this.video.id) {
              if (ev.stream == "00000000-0000-0000-0000-000000000000") {
                console.log(
                  "load stream description - no new",
                  ev.stream,
                  this.video.channel.id
                );
              } else {
                console.log(
                  "load stream description - next",
                  ev.stream,
                  this.video.channel.id
                );
              }
              this.load();
              this.$refs.player.play();
            }
          }
        );
      });
    },
    load() {
      api.Channels.GetStream(this.channelid).then(
        (resp) => {
          this.video = resp.data;
          if (this.video.poster == "") {
            this.video.poster = resp.data.channel.logo;
          }
        },
        () => {
          api.Channels.Get(this.channelid).then((resp) => {
            this.video = {
              id: "00000000-0000-0000-0000-000000000000",
              channel: resp.data.data,
              poster: resp.data.data.logo,
              lang: {
                title: "No Stream Live",
                subtitle: "no event scheduled",
                short: "This Channel has no stream event scheduled",
                long: "This Channel has no stream event scheduled",
              },
            };
          });
        }
      );
    },
  },
};
</script>
