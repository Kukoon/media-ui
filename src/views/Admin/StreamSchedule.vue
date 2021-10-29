<template>
  <v-container fluid class="pa-0">
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
        id="calendar"
        ref="calendar"
        v-model="focus"
        color="primary"
        :type="type"
        :events="streams"
        :event-color="getStreamColor"
        :event-ripple="false"
        :weekdays="weekOrder"
        show-week
        @click:event="(e) => onClickCapture(e)"
        @click:more="zoom"
        @click:date="zoom"
        @change="fetchStreams"
        @mousedown:event="dragStart"
        @mousedown:time="startTime"
        @mousemove:time="moveTime"
        @mouseup:time="dragEnd"
        @mouseleave.native="dragCancel"
      >
        <template v-slot:event="{ event, timed, eventSummary }">
          <div class="v-event-draggable" v-html="eventSummary()"></div>
          <div
            v-if="timed"
            class="v-event-drag-bottom"
            @mousedown.stop="resize(event)"
          ></div>
        </template>
      </v-calendar>
      <v-dialog v-model="selectedOpen" :activator="selectedElement" width="540">
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
      dragging: false,
      focus: "",
      timer: null,
      type: "week",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
      },
      streams: [],
      streamDrag: null,
      streamDragTime: null,
      streamResizeTime: null,
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
    fetchStreams({ start, end }, deletedStreamID) {
      api.Streams.ListChannelMy(this.channelid, {
        from: new Date(start.date + "T00:00:00").toJSON(),
        to: new Date(end.date + "T23:59:59").toJSON(),
      }).then((response) => {
        this.streams = response.data.map((el) => {
          if (el.id !== deletedStreamID) {
            return {
              id: el.id,
              color: this.getStreamColor(el),
              name: el.lang
                ? el.lang.title
                : el.common_name
                ? el.common_name
                : el.id,
              start: new Date(el.start_at),
              end: new Date(el.end_at),
              timed: true,
              data: el,
            };
          }
        });
      });
    },
    loadStreams(deletedStreamID) {
      this.fetchStreams(
        {
          start: this.$refs.calendar.lastStart,
          end: this.$refs.calendar.lastEnd,
        },
        deletedStreamID
      );
    },
    dragStart({ event, timed }) {
      if (event && timed) {
        this.streamDrag = event;
        this.streamDragTime = null;
        this.streamResizeTime = null;
        this.timer = setTimeout(() => this.onTimer(), 100);
      }
    },
    onTimer() {
      this.timer = null;
      this.dragging = true;
    },
    dragEnd() {
      if (this.streamDrag) {
        const newStart = new Date(this.streamDrag.start);
        if (
          newStart.getTime() !==
          new Date(this.streamDrag.data.start_at).getTime()
        ) {
          this.streamDrag.data.start_at = newStart;
          this.streamDrag.data.end_at = this.streamDrag.end;
          let stream = models.Stream.ToRequest(this.streamDrag.data);
          api.Streams.Save(this.streamDrag.id, stream).then(this.loadStreams);
        }
      }
      this.streamDrag = null;
      this.streamDragTime = null;
      this.streamResizeTime = null;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      setTimeout(() => (this.dragging = false));
    },
    dragCancel() {
      if (this.streamDrag) {
        this.streamDrag.start = new Date(this.streamDrag.data.start_at);
        this.streamDrag.end = new Date(this.streamDrag.data.end_at);
      }
      this.streamDrag = null;
      this.streamDragTime = null;
      this.streamResizeTime = null;
    },
    startTime(tms) {
      const mouse = this.toTime(tms);
      if (this.streamDrag) {
        this.streamDragTime = mouse - this.streamDrag.start;
      } else {
        const start_at = this.roundTime(mouse);
        api.Streams.Add(
          this.channelid,
          models.Stream.ToRequest({
            start_at: new Date(start_at).toJSON(),
            end_at: new Date(start_at + 60 * 60 * 1000).toJSON(),
          })
        ).then((resp) => {
          this.loadStreams();
          const targetEvent = null;
          const eventArr = [resp.data].map((el) => {
            return {
              id: el.id,
              color: this.getStreamColor(el),
              name: el.lang
                ? el.lang.title
                : el.common_name
                ? el.common_name
                : el.id,
              start: new Date(el.start_at),
              end: new Date(el.end_at),
              timed: true,
              data: el,
            };
          });
          const event = eventArr[0];
          this.showStream({ targetEvent, event });
        });
      }
    },
    moveTime(tms) {
      if (!this.streamDrag) {
        return;
      }
      const mouse = this.toTime(tms);
      if (this.streamDragTime !== null) {
        const duration = this.streamDrag.end - this.streamDrag.start;
        this.streamDrag.start = this.roundTime(mouse - this.streamDragTime);
        this.streamDrag.end = this.streamDrag.start + duration;
      } else if (this.streamResizeTime !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.streamResizeTime);
        const max = Math.max(mouseRounded, this.streamResizeTime);

        this.streamDrag.start = min;
        this.streamDrag.end = max;
      }
      this.timer = setTimeout(() => this.onTimer(), 100);
    },
    resize(ev) {
      this.streamDrag = ev;
      this.streamResizeTime = ev.start;
    },
    onClickCapture(e) {
      if (this.dragging) {
        this.dragging = false;
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
      } else {
        const nativeEvent = e.nativeEvent;
        const event = e.event;
        this.showStream({ nativeEvent, event });
      }
    },
    showStream({ nativeEvent, event }) {
      const open = () => {
        this.selectedStream = event.data;
        this.selectedStreamColor = event.color;
        if (nativeEvent) {
          this.selectedElement = nativeEvent.target;
        }
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
      if (nativeEvent) nativeEvent.stopPropagation();
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
        this.loadStreams(id);
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

<style lang="scss" scoped>
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }

  &:hover::after {
    display: block;
  }
}
</style>

<style scoped>
#calendar >>> .v-btn {
  width: 34px;
  height: 34px;
}
</style>
