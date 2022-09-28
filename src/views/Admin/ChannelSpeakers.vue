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
          <h3 class="pb-2">Speakers</h3>
          <v-spacer />
          <v-btn icon small @click="add()">
            <v-icon small> mdi-plus </v-icon>
          </v-btn>
        </v-row>
        <v-card flat rounded>
          <v-card-title class="pt-0">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table :headers="headers" :items="list" :search="search"
            ><template #item.actions="{ item }">
              <v-icon small class="mr-2" @click="edit(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                small
                class="mr-2"
                @click="
                  removeID = item.id;
                  confirmRemove = true;
                "
              >
                mdi-delete
              </v-icon>
            </template></v-data-table
          >
        </v-card>
        <v-btn class="mt-4" color="info" @click="add()">
          <v-icon left> mdi-plus </v-icon>
          Add Speaker
        </v-btn>
        <SpeakerEditDialog
          v-if="showDialog"
          :formData="formData"
          :channelid="channelid"
          @closeSpeakerEditDialog="closeSpeakerEditDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { api } from "@/services/api.js";
import SpeakerEditDialog from "@/components/SpeakerEditDialog.vue";

export default {
  name: "ChannelSpeakers",
  components: {
    SpeakerEditDialog,
  },
  props: ["channelid"],
  data() {
    return {
      confirmRemove: false,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Organisation", value: "organisation", align: "start" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      info: false,
      list: [],
      formDefault: {},
      formData: {},
      removeID: null,
      search: "",
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
      api.Speakers.ListChannelMy(this.channelid)
        .then((resp) => (this.list = resp.data))
        .catch(() => {
          this.list = [];
        });
    },
    remove(id) {
      api.Speakers.Delete(id).then(() => {
        this.load();
        this.removeID = null;
        this.confirmRemove = false;
      });
    },
    clear() {
      this.formData = Object.assign({}, this.formDefault);
    },
    closeSpeakerEditDialog(v) {
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