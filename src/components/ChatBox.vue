<template>
  <v-card
    id="ChatBox"
    tile
    outlined
    height="70vh"
    class="d-flex flex-column"
    style="min-height: 0px"
  >
    <v-card-title class="neutral lighten-1">
      Chat
    </v-card-title>
    <v-card-subtitle class="neutral lighten-1">
      Ask your Questions here
    </v-card-subtitle>
    <v-divider />
    <v-card-text
      v-chat-scroll
      class="ma-0 px-4 py-0 fill-height"
      style="overflow: auto"
    >
      <v-row
        class="fill-height"
        align="end"
      >
        <v-col>
          <v-overlay
            id="overlay"
            absolute
            :value="!allowCookie"
          />
          <v-dialog
            max-width="290"
            :value="!allowCookie"
            attach="#overlay"
            hide-overlay
            persistent
            :close-on-content-click="false"
          >
            <v-card>
              <v-card-title>Cookie Policy</v-card-title>
              <v-card-text>
                To assign a fixed username, we need to set a cookie
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  color="success"
                  @click="accept()"
                >
                  Acccept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div
            v-for="(item, index) in chat"
            :key="index"
            :class="[
              'd-flex flex-row align-center my-2',
              item.me ? 'justify-end' : null,
            ]"
          >
            <span
              v-if="item.me"
              class="mr-3"
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
              v-if="!item.me"
              class="ml-3"
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
      <v-window
        v-model="step"
        class="flex-grow-1"
      >
        <v-window-item :value="1">
          <v-row no-gutters>
            <div class="d-flex flex-row align-center flex-grow-1 py-1">
              <v-textarea
                v-model="userName"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-3'"
                class="black--text mt-0 pt-0"
                auto-grow
                rows="1"
                dense
                outlined
                hide-details
                placeholder="Choose a Username"
                @keypress.enter="setUsername"
              />
              <v-btn
                depressed
                class="ml-2"
                color="success"
                @click="setUsername"
              >
                Save
              </v-btn>
            </div>
          </v-row>
        </v-window-item>
        <v-window-item :value="2">
          <v-row no-gutters>
            <v-col>
              <div class="d-flex flex-row align-center py-1">
                <v-menu
                  v-model="userMenu"
                  top
                  offset-y
                  nudge-top="6"
                  :close-on-content-click="false"
                >
                  <template #activator="{ on, attrs }">
                    <v-avatar
                      :color="randomColor"
                      class="mr-2"
                      size="40"
                      :alt="userName"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <span class="text-h5 mt-1 grey--text text--lighten-5">
                        {{ userName.charAt(0) }}
                      </span>
                    </v-avatar>
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item>
                        <v-list-item-avatar :color="randomColor">
                          <span class="text-h5 mt-1 grey--text text--lighten-5">
                            {{ userName.charAt(0) }}
                          </span>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{ userName }}</v-list-item-title>
                          <v-list-item-subtitle>User</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
                <v-textarea
                  v-model="msg"
                  :color="darkMode ? 'grey lighten-3' : 'grey darken-3'"
                  class="black--text mt-0 pt-0"
                  auto-grow
                  rows="1"
                  dense
                  outlined
                  hide-details
                  placeholder="Please be awesome!"
                  @keypress.enter="send"
                />
                <v-btn
                  fab
                  small
                  class="ml-2"
                  color="warning"
                  depressed
                  @click="send"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { websocket } from "@/services/websocket.js";
import { config } from "../../config.js";

export default {
  name: "ChatBox",
  props: ["room"],
  data() {
    return {
      allowCookie: true, // TODO not yet implemented - first backend
      chat: [],
      keepOpen: true,
      msg: null,
      step: 1,
      userMenu: false,
      userName: "",
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
    randomColor() {
      const colors = config.colors.calendar;
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
  watch: {
    room(to, from) {
      console.log("switch", from, to);
      websocket.leave(from);
      websocket.joinChat(to, this.onMessage);
    },
  },
  created() {
    websocket.joinHandler(this.room, "chat", 'ChatBox', this.onMessage);
  },
  methods: {
    accept() {
      this.allowCookie = true;
    },
    setUsername() {
      websocket.setUsername(this.room, this.userName).then((err) => {
        if(!err) {
          this.step++
        } else {
          // TODO - error handling in UI
          console.log("setUsername", err);
	}
      })
    },
    onMessage(msg) {
      this.chat.push({
        from: msg.username,
        me: !msg.username,
        msg: websocket.renderText(msg.data),
      });
    },
    async send(e) {
      // Send message with 'Ctrl+Enter'
      if (e.ctrlKey) {
        websocket.sendChat(this.room, this.msg)
        this.chat.push({
          from: this.userName,
          me: true,
          msg: websocket.renderText(this.msg),
        });
        this.msg = null;
      }
    },
  },
};
</script>

<style scoped>
#ChatBox >>> .v-dialog__content {
  top: unset !important;
  left: unset !important;
}
</style>
