<template>
  <v-row class="fill-height">
    <v-col>
      <h2 class="mt-4 mx-2 mb-2">Streams of {{ channel.title }}</h2>
      <v-fab-transition>
        <v-btn
          color="green"
          fixed
          bottom
          right
          fab
          :to="{ name: 'StreamAdd', params: {channelid: channelid } }"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-sheet>
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
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
          show-week
          :type="type"
          :events="streams"
          :event-color="getStreamColor"
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
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <PreviewCard
           :video="selectedStream"
           :noLink="true"
           :isStream="true"
          >
            <v-card-actions>
              <v-btn
                text
                color="green"
                :to="{ name: 'StreamEdit', params: { channelid: channelid, streamid: selectedStream.id } }"
              >
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn
                text
                color="red"
                @click="deleteStream(selectedStream.id)"
              >
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
              <v-btn
                text
                color="blue"
                @click="exportStream(selectedStream.id)"
              >
                <v-icon left>mdi-video-plus</v-icon>
                Export
              </v-btn>
              <v-btn
                text
                @click="selectedOpen = false"
              >
                <v-icon left>mdi-close</v-icon>
                Cancel
              </v-btn>
            </v-card-actions>
          </PreviewCard>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { api } from "@/services/api.js";
import { uuidToArrayElement, models } from "@/services/lib.js";
import { config } from "../../../config.js";

import PreviewCard from "@/components/PreviewCard.vue";

export default {
  name: "ChannelStreams",
  props: ["channelid"],
  components: {
    PreviewCard,
  },
  data() {
    return {
      channel: { title: 'unknown' },
      focus: '',
      type: 'week',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      streams: [],
      streamDrag: null,
      streamDragTime: null,
      selectedOpen: false,
      selectedElement: null,
      selectedStream: {},
    };
  },
  methods: {
    setToday () {
      this.focus = ''
    },
    zoom ({ date }) {
      this.focus = date
      if (this.type == 'month') {
        this.type = 'week'
      } else{
        this.type = 'day'
      }
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    load() {
      api
        .Channels.Get(this.channelid)
        .then((response) => this.channel = response.data );
    },
    getStreamColor(stream) {
      return uuidToArrayElement(stream.id, config.colors.calendar)
    },
    toTime (tms) {
        return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    roundTime (time, down = true) {
      const roundTo = 15 * 60 * 1000 // 15 minutes
      return down
        ? time - time % roundTo
        : time + (roundTo - (time % roundTo))
    },
    fetchStreams ({ start, end }) {
      api
        .Streams.ListChannelMy(this.channelid,
	{
          from: new Date(start.date +"T00:00:00").toJSON(),
          to: new Date(end.date+"T23:59:59").toJSON(),
        })
        .then((response) => {
          this.streams = response.data.map((el)=> {
            const start = new Date(el.start_at);
            return {
              id: el.id,
              color: this.getStreamColor(el),
              name: el.lang ? el.lang.title : el.common_name ? el.common_name : el.id,
              start: start,
              timed: true,
              data: el,
            }
          });
        });
    },
    loadStreams() {
      this.fetchStreams({
        start: this.$refs.calendar.lastStart,
        end: this.$refs.calendar.lastEnd,
      })
    },
    dragStart ({ event, timed }) {
        if (event && timed) {
          this.streamDrag = event;
          this.streamDragTime = null;
        }
    },
    dragEnd () {
      if (this.streamDrag) {
        const newStart = new Date(this.streamDrag.start)
        if (newStart.getTime() !== new Date(this.streamDrag.data.start_at).getTime()) {
          let stream = models.Stream.ToRequest(this.streamDrag.data);
          stream.start_at = newStart.toJSON();
          api.Streams.Save(this.streamDrag.id, stream).then(this.loadStreams);
	}
      }
      this.streamDrag = null;
      this.streamDragTime = null;
    },
    dragCancel () {
      this.streamDrag = null;
      this.streamDragTime = null;
    },
    startTime (tms) {
      const mouse = this.toTime(tms)
      if (this.streamDrag) {
        this.streamDragTime = mouse - this.streamDrag.start;
      } else {
        api.Streams.Add(this.channelid, models.Stream.ToRequest({
          start_at: new Date(this.roundTime(mouse)).toJSON(),
        })).then(this.loadStreams)
      }
    },
    moveTime (tms) {
      const mouse = this.toTime(tms)
      if (this.streamDrag && this.streamDragTime !== null) {
        this.streamDrag.start = this.roundTime(mouse - this.streamDragTime);
      }
    },
    showStream ({ nativeEvent, event }) {
      const open = () => {
        this.selectedStream = event.data
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    exportStream(id) {
      api.Streams.Export(id).then(()=>{
        this.$router.replace({ name: "RecordingEdit", params: { channelid: this.channelid, recordingid: id } });
      });
    },
    deleteStream(id) {
      api.Streams.Delete(id).then(()=>{
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
  },
  mounted () {
    this.$refs.calendar.checkChange()
  },
  created() {
    this.load();
  },
};
</script>

