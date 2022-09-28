<template>
  <v-container fluid>
    <v-card>
      <v-overlay :value="confirmRemove">
        <v-snackbar
          v-model="confirmRemove"
          app
          top
          max-width="100%"
          transition="scroll-y-transition"
        >
          <v-alert
            id="alert"
            v-model="confirmRemove"
            class="mb-0"
            type="error"
            icon="mdi-alert"
            dense
            dismissible
          >
            <v-row align="center">
              <v-col class="grow">
                Do you really want to remove this channel? This action cannot be
                undone.
              </v-col>
              <v-col class="shrink">
                <v-btn outlined @click="remove()"> Remove </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-snackbar>
      </v-overlay>
      <v-card-title>Channel Profile</v-card-title>
      <v-card-text>
        <div class="d-flex mt-4">
          <div
            class="d-flex flex-column mr-2 align-center"
            style="width: 200px"
          >
            <v-avatar class="ma-4" rounded="0" height="128" width="128">
              <v-img v-if="channel.logo" :src="channel.logo" contain />
            </v-avatar>
            <v-btn fab depressed @click="showUploadDialog = true" class="mt-2">
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
          </div>
          <div class="d-flex flex-grow-1 ml-2">
            <v-form class="pa-0 mt-2" @submit="save()" style="width: 100%">
              <v-text-field
                v-model="channel.title"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Title"
                outlined
                dense
                @input="enableSave = true"
              />
              <v-text-field
                v-model="channel.common_name"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Comman Name (used in URLs)"
                outlined
                dense
                @input="enableSave = true"
              />
              <v-text-field
                v-model.lazy="channel.logo"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Logo URL"
                outlined
                dense
                @input="enableSave = true"
              >
              </v-text-field>
            </v-form>
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="neutral lighten-1">
        <v-btn
          v-if="channelid"
          class="ml-1"
          color="error"
          text
          @click="confirmRemove = true"
        >
          <v-icon left> mdi-delete </v-icon>
          Delete
        </v-btn>
        <v-btn
          class="ml-auto mr-1"
          color="success"
          :disabled="!enableSave"
          @click="save()"
        >
          <v-icon left> mdi-content-save </v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-divider v-if="channelid" class="mt-4 mb-4" />
    <v-card v-if="channelid">
      <v-card-title>Stream Ingress</v-card-title>
      <v-card-text>
        <v-simple-table v-if="channelid" dense>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Description</th>
                <th class="text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RTMP Complete Link</td>
                <td>
                  <code>{{ ingressRTMP }}</code>
                </td>
              </tr>
              <tr>
                <td>RTMP URL</td>
                <td>
                  <code>{{
                    ingressRTMP.slice(
                      0,
                      ingressRTMP.length -
                        ingressRTMP.split("/").slice(-1)[0].length -
                        1
                    )
                  }}</code>
                </td>
              </tr>
              <tr>
                <td>Secret</td>
                <td>
                  <code>{{ ingressRTMP.split("/").slice(-1)[0] }}</code>
                </td>
              </tr>
              <tr>
                <td>
                  Stream from Browser, by using this WebRTC-URL in Input like
                  <a
                    href="https://demo.ovenplayer.com/demo_input.html"
                    target="_blank"
                  >
                    OvenPlayer Demo Input
                  </a>
                </td>
                <td>
                  <code>{{ ingressWS }}</code>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <UploadDialog
          v-if="showUploadDialog"
          :channelid="channelid"
          @closeUploadDialog="closeUploadDialog"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import UploadDialog from "@/components/UploadDialog.vue";

export default {
  name: "ChannelProfile",
  components: {
    UploadDialog,
  },
  props: ["channelid"],
  data() {
    return {
      ingressRTMP: "",
      ingressWS: "",
      channel: {},
      channelFormDefault: {},
      enableSave: false,
      confirmRemove: false,
      showUploadDialog: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    channelid() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    save() {
      let resp = null;
      if (this.channelid) {
        resp = api.Channels.Save(this.channelid, this.channel);
      } else {
        resp = api.Channels.Add(this.channel);
      }
      resp.then((response) => {
        this.channel = response.data;
        this.$emit("change-channel");
      });
    },
    remove() {
      api.Channels.Delete(this.channelid).then(() => {
        this.$emit("change-channel");
        this.$router.replace({ name: "ChannelAdd" });
      });
      this.confirmRemove = false;
    },
    cancel() {
      this.confirmRemove = false;
    },
    load() {
      if (!this.channelid) {
        this.channel = Object.assign({}, this.channelFormDefault);
        return;
      }
      api.Channels.Get(this.channelid).then((response) => {
        this.channel = response.data.data;
        this.ingressRTMP = response.data.ingress.rtmp;
        this.ingressWS = response.data.ingress.webrtc;
      });
    },
    closeUploadDialog(v) {
      this.showUploadDialog = v;
    },
  },
};
</script>

<style scoped>
#alert {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.v-snack >>> .v-snack__content {
  padding: 0 !important;
}
.v-snack >>> .v-snack__wrapper {
  display: block;
  margin: 0;
  width: 60% !important;
  min-height: unset !important;
}
</style>