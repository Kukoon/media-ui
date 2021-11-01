<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">Server</h3>
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Status</td>
                <td v-if="status.up" class="green--text">Running</td>
                <td v-else class="red--text">Stopped</td>
              </tr>
              <tr>
                <td>Version</td>
                <td>{{ status.version }}</td>
              </tr>
            </tbody>
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
