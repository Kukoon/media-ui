<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">Server</h3>
        <v-simple-table>
          <template v-slot:default>
            <tr>
              <td class="grey--text pa-2">Status</td>
              <td v-if="status.up" class="green--text pa-2">Running</td>
              <td v-else class="red--text pa-2">Stopped</td>
            </tr>
            <tr>
              <td class="grey--text pa-2">Version</td>
              <td class="font-weight-medium pa-2">{{ status.version }}</td>
            </tr>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

import { config } from "../../../config.js";

export default {
  name: "Server",
  data() {
    return {
      status: {
        version: "unkown",
        up: false,
      },
    };
  },
  created() {
    axios
      .get(new URL(config.apiURL + "/../status"))
      .then((resp) => (this.status = resp.data));
  },
};
</script>
