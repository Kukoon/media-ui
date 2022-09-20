<template>
  <v-container fluid>
    <v-row no-gutters>
      <h3 class="pb-2">Stream Schedule</h3>
      <v-spacer />
      <v-btn icon small @click="addStream(new Date().getTime())">
        <v-icon small> mdi-plus </v-icon>
      </v-btn>
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
          <h5 style="font-weight: 400">
            {{ $refs.calendar.title }}
          </h5>
        </v-toolbar-title>
        <v-spacer />
        <v-menu bottom right>
          <template #activator="{ on, attrs }">
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
      <v-calendar
        id="calendar"
        ref="calendar"
        v-model="focus"
        color="primary"
        class="pb-4"
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
        <template #event="{ event, timed, eventSummary }">
          <div class="v-event-draggable" v-html="eventSummary()" />
          <div
            v-if="timed"
            class="v-event-drag-bottom"
            @mousedown.stop="resize(event)"
          />
        </template>
        <template #day-body="{ date, week }">
          <div
            class="v-current-time"
            :class="{ first: date === week[0].date }"
            :style="{ top: nowY }"
          ></div>
        </template>
      </v-calendar>
      <v-dialog
        v-if="selectedOpen"
        v-model="selectedOpen"
        :activator="selectedElement"
        width="540"
      >
        <StreamEditDialog
          :key="dialogKey"
          :channelid="channelid"
          :streamid="selectedStream.id"
          :stream-color="selectedStreamColor"
          @loadStreams="loadStreams"
          @closeDialog="selectedOpen = false"
          @keydown.esc="selectedOpen = false"
        />
      </v-dialog>
    </v-sheet>
    <v-btn class="mt-4" color="info" @click="addStream(new Date().getTime())">
      <v-icon left> mdi-plus </v-icon>
      Add Stream
    </v-btn>
  </v-container>
</template>

<script>
import { api } from "@/services/api.js";
import { uuidToArrayElement, models } from "@/services/lib.js";
import { config } from "../../../config.js";

import StreamEditDialog from "@/components/StreamEditDialog.vue";

export default {
  name: "StreamSchedule",
  components: {
    StreamEditDialog,
  },
  props: ["channelid"],
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
      ready: false,
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
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
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
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    this.$refs.calendar.checkChange();
  },
  created() {
    this.load();
  },
  methods: {
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
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
        (response) => (this.channel = response.data.data)
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
    addStream(start_at) {
      api.Streams.Add(
        this.channelid,
        models.Stream.ToRequest({
          listen_at: new Date().toJSON(),
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
    },
    startTime(tms) {
      const mouse = this.toTime(tms);
      if (this.streamDrag) {
        this.streamDragTime = mouse - this.streamDrag.start;
      } else {
        const start_at = this.roundTime(mouse);
        this.addStream(start_at);
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

<style lang="scss" scoped>
#calendar {
  border-bottom-right-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}
#calendar ::v-deep .v-btn {
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
.theme--dark.v-calendar-daily ::v-deep .v-calendar-daily__intervals-head {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily ::v-deep .v-calendar-daily_head-day {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily ::v-deep .v-calendar-daily__intervals-body {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily ::v-deep .v-calendar-daily__day {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily ::v-deep .v-calendar-daily__day-interval {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily ::v-deep .v-calendar-daily__interval::after {
  border-color: rgba(255, 255, 255, 0.12);
}
.theme--dark.v-calendar-daily
  ::v-deep
  .v-calendar-daily__intervals-head::after {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12));
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
