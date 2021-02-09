<template>
  <v-card
    tile
    outlined
    height="70vh"
    class="d-flex flex-column"
    style="min-height: 0px"
  >
    <v-card-title class="neutral">Chat</v-card-title>
    <v-card-subtitle class="neutral">Ask your Questions here</v-card-subtitle>
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
              item.from == 'user' ? 'justify-end' : null,
            ]"
          >
            <span v-if="item.from == 'user'" class="mr-3">
              {{ item.msg }}
            </span>
            <v-avatar
              :color="item.from == 'user' ? 'accent' : 'primary'"
              size="32"
            >
              <span class="white--text">
                {{ item.from[0] }}
              </span>
            </v-avatar>
            <span v-if="item.from != 'user'" class="ml-3">
              {{ item.msg }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions class="mt-auto neutral lighten-3">
      <v-row no-gutters>
        <v-col>
          <div class="d-flex flex-row align-end">
            <v-textarea
              class="black--text mt-0 pt-0"
              v-model="msg"
              auto-grow
              rows="1"
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
export default {
  name: "ChatBox",
  data() {
    return {
      chat: [],
      msg: null,
    };
  },
  methods: {
    send() {
      this.chat.push({
        from: "user",
        msg: this.msg,
      });
      this.msg = null;
    },
  },
};
</script>