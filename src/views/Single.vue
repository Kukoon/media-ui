<template>
  <VideoPlayer
    ref="player"
    :source="source"
    :poster="video.poster"
  />
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";

import { config } from "../../config.js"; // HLS url
import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Single",
  components: { VideoPlayer },
  props: ['id'],
  data() {
    return {
      source: null,
      video: null,
    };
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.load();
  },
  methods: {
    connectStream() {
      return api.Channels.Get(this.id).then((resp) => {
        this.source = config.sourceURL.replace("{ID}", resp.data.id);
        websocket.joinHandler(resp.data.id, 'status', 'single for poster', (ev) => {
          if (ev.stream != this.video.id) {
            if (ev.stream == "00000000-0000-0000-0000-000000000000") {
              console.log("load stream description - no new", ev.stream, this.video.channel.id)
            } else {
              console.log("load stream description - next", ev.stream, this.video.channel.id)
            }
            this.loadStream()
            this.$refs.player.play();
          }
        })
      })
    },
    loadStream() {
      return api.Channels.GetStream(this.id).then((resp) => {
        this.video = resp.data;
	if (this.video.poster == "") {
          this.video.poster = resp.data.channel.logo;
	}
      }, () => {
        api.Channels.Get(this.id).then((resp) => {
          this.video = {
            id: "00000000-0000-0000-0000-000000000000",
            channel: resp.data,
            poster: resp.data.logo,
            lang: {
              title: "No Stream Live",
              subtitle: "no event scheduled",
              short: "This Channel has no stream event scheduled",
              long: "This Channel has no stream event scheduled",
            },
          };
        });
      });
    },
    stream() {
      return this.connectStream().then(this.loadStream)
    },
    recording() {
        return api.Recordings.Get(this.id).then((response) => {
          this.video = response.data;
          const urls = this.video.formats.map((i) => i.url);
          this.source = urls[0];
        });
    },
    load() {
      if (this.$router.history.current.query.stream) {
		this.stream().catch(this.recording);
      }else{
		this.recording().catch(this.stream);
      }
    },
  },
};
</script>
