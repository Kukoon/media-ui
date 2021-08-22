<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Channels</h3>
        <v-divider class="mt-2"></v-divider>
        <v-expansion-panels accordion tile class="mt-4">
          <v-expansion-panel v-for="(item, n) in channels" :key="n">
            <v-expansion-panel-header>
              {{item.title}}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ChannelEditor :channel="item" />
            </v-expansion-panel-content>
          </v-expansion-panel>
       </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { api } from "@/services/api.js";

import ChannelEditor from "@/components/ChannelEditor.vue";

export default {
  name: "Channels",
  components: { ChannelEditor },
  data() {
    return {
      channels: [],
    }
  },
  methods: {
    load() {
      api
        .ListMyChannels()
        .then((response) => (this.channels = response.data));
    },
  },
  beforeRouteEnter(to, from, next) {next(vm => vm.load())},
  beforeRouteUpdate() {this.load()},
};
</script>
