<template>
  <v-row class="fill-height">
    <v-col>
      <h2 class="mt-4 mx-2 mb-2">Streams of {{ channel.title }}</h2>
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
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
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
          :events="streams"
          :event-color="getStreamColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="fetchStreams"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { api } from "@/services/api.js";

export default {
  name: "ChannelStreams",
  props: ["channelid"],
  data() {
    return {
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      streams: [],
      channel: { title: 'unknown' },
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    };
  },
  methods: {
    setToday () {
      this.focus = ''
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
      return this.colors[stream.id.charCodeAt(0) % this.colors.length];
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
            const start = new Date(el.start_at)
            return {
              id: el.id,
              color: this.getStreamColor(el),
              name: el.lang.title,
              start: start,
              timed: true,
            }
          });
        });
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

