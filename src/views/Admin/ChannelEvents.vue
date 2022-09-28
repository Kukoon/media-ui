<template>
  <v-container fluid>
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
        type="error"
        dismissible
        dense
        icon="mdi-alert"
        class="mb-0"
        color="success"
      >
        <v-row align="center">
          <v-col class="grow"> Do you really want to remove this Event? </v-col>
          <v-col class="shrink">
            <v-btn @click="remove(removeID)"> Remove </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-snackbar>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3>Events</h3>
          <v-spacer />
          <v-btn icon small @click="add()">
            <v-icon small> mdi-plus </v-icon>
          </v-btn>
        </v-row>
        <v-simple-table class="mt-2">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Logo</th>
                <th class="text-left">Name</th>
                <th class="text-left">Website</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" :key="item.id">
                <td>
                  <v-avatar v-if="item.logo" size="32px">
                    <img :src="item.logo" />
                  </v-avatar>
                </td>
                <td>{{ item.name }}</td>
                <td>
                  <a v-if="item.url" :href="item.url" target="_blank">{{
                    item.url
                  }}</a>
                </td>
                <td>
                  <v-btn icon small @click="edit(item)">
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click="
                      removeID = item.id;
                      confirmRemove = true;
                    "
                  >
                    <v-icon small> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-btn class="mt-4" color="info" @click="add()">
          <v-icon left> mdi-plus </v-icon>
          Add Event
        </v-btn>
        <EventEditDialog
          v-if="showDialog"
          :formData="formData"
          :channelid="channelid"
          @closeEventEditDialog="closeEventEditDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";
import EventEditDialog from "@/components/EventEditDialog.vue";

export default {
  name: "ChannelEvents",
  components: {
    EventEditDialog,
  },
  props: ["channelid"],
  data() {
    return {
      confirmRemove: false,
      info: false,
      list: [],
      formDefault: {},
      formData: {},
      removeID: null,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  watch: {
    channelid() {
      this.formData = Object.assign({}, this.formDefault);
      this.load();
    },
  },
  created() {
    this.formData = Object.assign({}, this.formDefault);
    this.load();
  },
  methods: {
    add() {
      this.formData = Object.assign({}, this.formDefault);
      this.showDialog = true;
    },
    edit(item) {
      this.showDialog = true;
      this.formData = item;
    },
    load() {
      api.Events.ListChannelMy(this.channelid)
        .then((resp) => (this.list = resp.data))
        .catch(() => {
          this.list = [];
        });
    },
    save() {
      let resp = null;
      if (this.formData.id) {
        resp = api.Events.Save(this.formData.id, this.formData);
      } else {
        resp = api.Events.Add(this.channelid, this.formData);
      }
      resp.then(() => {
        this.formData = Object.assign({}, this.formDefault);
        this.load();
      });
      this.showDialog = false;
    },
    remove(id) {
      api.Events.Delete(id).then(() => {
        this.removeID = null;
        this.confirmRemove = false;
        this.load();
      });
    },
    clear() {
      this.formData = Object.assign({}, this.formDefault);
      this.showDialog = false;
    },
    closeEventEditDialog(v) {
      this.showDialog = v;
      this.load();
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
