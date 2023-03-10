<template>
  <VideoPlayer ref="player" :sources="sources" :poster="video.poster" :autostart="autostart" />
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";

import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";
import { models } from "@/services/lib.js";

export default {
  name: "Single",
  components: { VideoPlayer },
  props: ["id"],
  data() {
    return {
      autostart: false,
      sources: null,
      video: {
        poster: "",
      },
    };
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    connectStream() {
      return api.Channels.Get(this.id).then((resp) => {
        this.sources = resp.data.stream_sources;
        websocket.joinHandler(
          resp.data.data.id,
          "status",
          "single for poster",
          (ev) => {
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
              this.loadStream();
              this.$refs.player.play();
            }
          }
        );
      });
    },
    loadStream() {
      return api.Channels.GetStream(this.id).then(
        (resp) => {
          this.video = resp.data;
          if (this.video.poster) {
            this.video.poster = resp.data.channel.logo;
          }
        },
        () => {
          api.Channels.Get(this.id).then((resp) => {
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
    stream() {
      this.autostart = true;
      return this.connectStream().then(this.loadStream);
    },
    recording() {
      this.autostart = false;
      return api.Recordings.Get(this.id).then((response) => {
        this.video = response.data;
        this.sources = models.Recording.PlayerSources(response.data);
      });
    },
    load() {
      if (this.$router.history.current.query.stream) {
        this.stream().catch(this.recording);
      } else {
        this.recording().catch(this.stream);
      }
    },
  },
};
</script>
