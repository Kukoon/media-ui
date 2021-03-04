<template>
  <v-card
    tile
    outlined
    height="70vh"
    class="d-flex flex-column"
    style="min-height: 0px"
  >
    <v-card-title class="neutral lighten-1">Chat</v-card-title>
    <v-card-subtitle class="neutral lighten-1"
      >Ask your Questions here</v-card-subtitle
    >
    <v-divider></v-divider>
    <v-card-text
      class="ma-0 px-4 py-0 fill-height"
      style="overflow: auto"
      v-chat-scroll
    >
      <v-row class="fill-height" align="end">
        <v-col>
          <div
            v-for="(item, index) in chat"
            :key="index"
            :class="[
              'd-flex flex-row align-center my-2',
              item.me ? 'justify-end' : null,
            ]"
          >
            <span
              class="mr-3"
              v-if="item.me"
              v-html="item.msg"
            />
            <v-avatar
              :color="item.me ? 'accent' : 'primary'"
              size="32"
            >
              <span class="white--text">
                {{ item.from[0] }}
              </span>
            </v-avatar>
            <span
             class="ml-3"
             v-if="!item.me"
             v-html="item.msg"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="px-2 pa-1 text-right justify-end warning--text">
      Press Ctrl+Enter to send
    </v-card-text>
    <v-divider />
    <v-card-actions class="mt-auto neutral lighten-3">
      <v-row no-gutters>
        <v-col>
          <div class="d-flex flex-row align-center">
            <v-textarea
              :color="darkMode ? 'grey lighten-3' : 'grey darken-3'"
              class="black--text mt-0 pt-0"
              v-model="msg"
              auto-grow
              rows="1"
              dense
              outlined
              hide-details
              placeholder="Please be awesome!"
              @keypress.enter="send"
            ></v-textarea>
            <v-btn icon class="ml-4" @click="send"
              ><v-icon>mdi-send</v-icon></v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { chat } from "@/services/chat.js";

export default {
  name: "ChatBox",
  props:["room"],
  data() {
    return {
      chat: [],
      msg: null,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  created() {
      chat.join(this.room, this.onMessage)
  },
  watch: {
    room(to,from) {
      console.log("switch", from, to);
      chat.leave(from)
      chat.join(to,this.onMessage)
    }
  },
  methods: {
    onMessage(msg) {
      if (!msg.getAttribute("type").includes("chat")) { return false; }
      const from = chat.getResourceFromJid(msg.getAttribute("from"));
      if(msg.textContent) {
        this.chat.push({
          from: from,
          me: from == chat.name,
          msg: chat.renderText(msg.textContent),
        })
      }
      return true;
    },
    send(e) {
      // Send message with 'Ctrl+Enter'
      if (e.ctrlKey) {
        chat.send(this.room, this.msg);
        this.msg = null;
      }
    },
  },
};
</script>
