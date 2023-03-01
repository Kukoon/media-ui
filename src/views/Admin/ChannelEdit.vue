<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Channel</h3>
        <v-alert
          v-if="confirmRemove"
          v-model="confirmRemove"
          class="mt-2"
          border="left"
          type="error"
          prominent
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
        <v-form class="pa-0 mt-2" @submit="save()">
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
          />
          <v-btn
            class="ml-auto mr-1"
            color="success"
            :disabled="!enableSave"
            @click="save()"
          >
            <v-icon left> mdi-content-save </v-icon>
            Save
          </v-btn>
          <v-btn
            v-if="channelid"
            class="ml-1"
            color="error"
            @click="confirmRemove = true"
          >
            <v-icon left> mdi-delete </v-icon>
            Delete
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "ChannelEdit",
  props: ["channelid"],
  data() {
    return {
      channel: {},
      channelFormDefault: {},
      enableSave: false,
      confirmRemove: false,
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
      api.Channels.Get(this.channelid).then(
        (response) => {
		this.channel = response.data.data;
	});
    },
  },
};
</script>
