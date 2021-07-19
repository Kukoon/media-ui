<template>
  <v-container fluid id="Live">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper :video="video" :viewers="viewers" :source="source" class="mx-n2" />
      </v-col>
      <v-col cols="12" md="4" v-if="video !== null && video.chat">
        <ChatBox class="ma-2" :room="video.channel.id" />
      </v-col>
      <v-col cols="12" md="4" v-if="video === null || !video.chat">
        <h3 class="mx-2 mt-2">Suggestions</h3>
        <v-divider class="mx-2 mb-4 mt-2" />
        <Suggestions class="hidden-sm-and-down" :videos="suggestions" />
        <VideoList class="hidden-md-and-up" :videos="suggestions" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

import ChatBox from "@/components/ChatBox";
import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import VideoList from "@/components/VideoList";
import Suggestions from "@/components/Suggestions";

import { mapGetters } from "vuex";

import { config } from "../../../config.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Live",
  components: {
    ChatBox,
    VideoPlayerWrapper,
    VideoList,
    Suggestions,
  },
  data() {
    return {
      video: null,
      source: "",
      viewers: 0,
      tagsPosition: "top",
      currentID: null,
      isRunning: true,
    };
  },
  computed: {
    ...mapGetters(["recordings"]),
    suggestions() {
      const result = this.recordings.filter(
        (recording) => recording.id != this.currentID
      );
      return result.slice(0, 3);
    },
  },
  methods: {
    loadStream() {
      const apiURL =
        config.apiURL +
        "/stream/" +
        this.$router.history.current.query.id +
        "?lang=de";
      axios.get(apiURL).then((response) => {
        this.video = response.data;
        websocket.joinHandler(this.video.channel.id, 'status', (ev) => {
		this.viewers = ev.viewers;
	})
        this.source = config.sourceURL.replace("{ID}", this.video.channel.id);
      });
    },
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
      this.loadStream();
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.currentID = this.$router.history.current.query.id;
    this.loadStream();
  },
};
</script>
