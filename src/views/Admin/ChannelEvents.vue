<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <h3>Events</h3>
          <v-spacer></v-spacer>
        </v-row>
        <v-simple-table dense class="mt-2">
          <template v-slot:default>
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
                 <v-avatar v-if="item.logo" size="36px"><img :src="item.logo" /></v-avatar>
		</td>
                <td>{{ item.name }}</td>
                <td>
                  <a v-if="item.url" :href="item.url" target="_blank">{{ item.url }}</a>
                </td>
                <td>
                  <v-btn icon small @click="formData = item">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small @click="remove(item.id)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <h4 class="mt-4" v-if="formData.id">Edit {{ formData.name }}</h4>
        <h4 class="mt-4" v-else>New</h4>
        <v-divider class="mt-2"></v-divider>
        <v-row no-gutters>
          <v-col>
            <v-form class="pa-0 mt-2" @submit="save()">
              <v-text-field
                v-model="formData.name"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Name"
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="formData.logo"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Logo"
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="formData.url"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="URL"
                required
                outlined
                dense
              ></v-text-field>
              <v-textarea
                v-model="formData.description"
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                label="Description"
                required
                outlined
                dense
              ></v-textarea>
              <v-btn class="ml-auto" color="sucess" @click="save()">
                <v-icon left>mdi-plus</v-icon>
                Add
              </v-btn>
              <v-btn class="ml-auto" @click="clear()">
                <v-icon left>mdi-close</v-icon>
                Clear
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "ChannelEvents",
  props: ["channelid"],
  data() {
    return {
      info: false,
      list: [],
      formDefault: {
      },
      formData: {},
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
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
    },
    remove(id) {
      api.Events.Delete(id).then(this.load);
    },
    clear() {
      this.formData = Object.assign({}, this.formDefault);
    },
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
};
</script>
