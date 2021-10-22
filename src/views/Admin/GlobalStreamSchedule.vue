<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">Global Stream Schedule</h3>
        <v-sheet>
          <v-toolbar flat dense class="align-center" rounded>
            <v-btn outlined small class="mr-4" @click="setToday"> Today </v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small @click="next" class="mr-4">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-sheet>
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            type="category"
            category-show-all
            :categories="channelNames"
            :events="streams"
            :event-color="getStreamColor"
            @change="fetchStreams"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { api } from "@/services/api.js";
import { uuidToArrayElement } from "@/services/lib.js";
import { config } from "../../../config.js";

export default {
  name: "GlobalStreamSchedule",
  data() {
    return {
      focus: "",
      streams: [],
      channelIDs: [],
      channelNames: [],
    };
  },
  methods: {
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    load() {
      api.Channels.My().then((response) => {
        this.channelIDs = response.data.map((el) => el.id);
        this.channelNames = response.data.map((el) => el.title);
      });
    },
    getStreamColor(stream) {
      return uuidToArrayElement(stream.id, config.colors.calendar);
    },
    fetchStreams({ start, end }) {
      api.Streams.List({
        channel: this.channelIDs,
        from: new Date(start.date + "T00:00:00").toJSON(),
        to: new Date(end.date + "T23:59:59").toJSON(),
      }).then((response) => {
        this.streams = response.data.map((el) => {
          const start = new Date(el.start_at);
          return {
            id: el.id,
            color: this.getStreamColor(el),
            name: el.lang
              ? el.lang.title
              : el.common_name
              ? el.common_name
              : el.id,
            start: start,
            timed: true,
            category: el.channel.title,
          };
        });
      });
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.load();
  },
};
</script>

