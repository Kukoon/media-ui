<template>
  <v-container fluid>
    <v-row no-gutters>
      <h3 class="pb-2">Global Stream Schedule</h3>
      <v-spacer />
    </v-row>
    <v-sheet rounded>
      <v-toolbar flat dense class="align-center" rounded>
        <v-btn outlined small class="mr-4" @click="setToday"> Today </v-btn>
        <v-btn fab text x-small @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text x-small class="mr-4" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          <h5 style="font-weight: 400">{{ $refs.calendar.title }}</h5>
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-calendar
        id="calendar"
        ref="calendar"
        v-model="focus"
        class="pb-4"
        color="primary"
        type="category"
        category-show-all
        :categories="channelNames"
        :events="streams"
        :event-color="getStreamColor"
        @change="fetchStreams"
      />
    </v-sheet>
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
  mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.load();
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
};
</script>

<style scoped>
#calendar {
  border-bottom-right-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}
#calendar >>> .v-btn {
  width: 34px;
  height: 34px;
}
.theme--dark.v-toolbar.v-sheet {
  background-color: var(--v-neutral-lighten1) !important;
}
.theme--light.v-calendar-daily {
  border-top: 0px !important;
  border-left: 0px !important;
}

.theme--dark.v-calendar-daily {
  background-color: var(--v-neutral-lighten1) !important;
  border-color: rgba(255, 255, 255, 0.12);
  border-left: 0;
  border-top: 0;
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily__intervals-head {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily_head-day {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily__intervals-body {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily__day {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily__day-interval {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily__interval::after {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily >>> .v-calendar-daily__intervals-head::after {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12));
}
</style>