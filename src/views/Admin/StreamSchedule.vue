<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">Stream Schedule</h3>
        <v-sheet rounded>
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
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined small v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :type="type"
            :events="streams"
            :event-color="getStreamColor"
            :weekdays="weekOrder"
            show-week
            @click:event="showStream"
            @click:more="zoom"
            @click:date="zoom"
            @change="fetchStreams"
            @mousedown:event="dragStart"
            @mousedown:time="startTime"
            @mousemove:time="moveTime"
            @mouseup:time="dragEnd"
            @mouseleave.native="dragCancel"
          ></v-calendar>
          <v-dialog
            v-model="selectedOpen"
            :activator="selectedElement"
            width="540"
          >
            <StreamEditDialog
              :key="dialogKey"
              :video="selectedStream"
              :channelid="channelid"
              :streamid="selectedStream.id"
              :streamColor="selectedStreamColor"
              @loadStreams="this.loadStreams"
              @closeDialog="selectedOpen = false"
            >
            </StreamEditDialog>
          </v-dialog>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { api } from "@/services/api.js";
import { uuidToArrayElement, models } from "@/services/lib.js";
import { config } from "../../../config.js";

import StreamEditDialog from "@/components/StreamEditDialog.vue";

export default {
  name: "StreamSchedule",
  props: ["channelid"],
  components: {
    StreamEditDialog,
  },
  data() {
    return {
      channel: { title: "unknown" },
      dialogKey: 0,
      focus: "",
      type: "week",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
      },
      streams: [],
      streamDrag: null,
      streamDragTime: null,
      selectedOpen: false,
      selectedElement: null,
      selectedStream: {},
      selectedStreamColor: String,
      weekOrder: [1, 2, 3, 4, 5, 6, 0],
    };
  },
  methods: {
    setToday() {
      this.focus = "";
    },
    zoom({ date }) {
      this.focus = date;
      if (this.type == "month") {
        this.type = "week";
      } else {
        this.type = "day";
      }
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    load() {
      api.Channels.Get(this.channelid).then(
        (response) => (this.channel = response.data)
      );
    },
    getStreamColor(stream) {
      return uuidToArrayElement(stream.id, config.colors.calendar);
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    roundTime(time, down = true) {
      const roundTo = 15 * 60 * 1000; // 15 minutes
      return down
        ? time - (time % roundTo)
        : time + (roundTo - (time % roundTo));
    },
    fetchStreams({ start, end }) {
      api.Streams.ListChannelMy(this.channelid, {
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
            data: el,
          };
        });
      });
    },
    loadStreams() {
      this.fetchStreams({
        start: this.$refs.calendar.lastStart,
        end: this.$refs.calendar.lastEnd,
      });
    },
    dragStart({ event, timed }) {
      if (event && timed) {
        this.streamDrag = event;
        this.streamDragTime = null;
      }
    },
    dragEnd() {
      if (this.streamDrag) {
        const newStart = new Date(this.streamDrag.start);
        if (
          newStart.getTime() !==
          new Date(this.streamDrag.data.start_at).getTime()
        ) {
          let stream = models.Stream.ToRequest(this.streamDrag.data);
          stream.start_at = newStart.toJSON();
          api.Streams.Save(this.streamDrag.id, stream).then(this.loadStreams);
        }
      }
      this.streamDrag = null;
      this.streamDragTime = null;
    },
    dragCancel() {
      this.streamDrag = null;
      this.streamDragTime = null;
    },
    startTime(tms) {
      const mouse = this.toTime(tms);
      if (this.streamDrag) {
        this.streamDragTime = mouse - this.streamDrag.start;
      } else {
        api.Streams.Add(
          this.channelid,
          models.Stream.ToRequest({
            start_at: new Date(this.roundTime(mouse)).toJSON(),
          })
        ).then(this.loadStreams);
      }
    },
    moveTime(tms) {
      const mouse = this.toTime(tms);
      if (this.streamDrag && this.streamDragTime !== null) {
        this.streamDrag.start = this.roundTime(mouse - this.streamDragTime);
      }
    },
    showStream({ nativeEvent, event }) {
      const open = () => {
        this.selectedStream = event.data;
        this.selectedStreamColor = event.color;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    exportStream(id) {
      api.Streams.Export(id).then(() => {
        this.$router.replace({
          name: "RecordingEdit",
          params: { channelid: this.channelid, recordingid: id },
        });
      });
    },
    deleteStream(id) {
      api.Streams.Delete(id).then(() => {
        this.selectedOpen = false;
        this.loadStreams();
      });
    },
  },
  watch: {
    channelid() {
      this.load();
      this.loadStreams();
    },
    selectedOpen() {
      if (!this.selectedOpen) {
        this.dialogKey += 1;
      }
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

