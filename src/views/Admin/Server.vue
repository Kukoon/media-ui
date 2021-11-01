<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">Server</h3>
        <v-simple-table>
          <template #default>
            <tbody>
              <tr>
                <td>Status</td>
                <td v-if="status.up">
                  <v-chip
                    small
                    color="success"
                    :text-color="darkMode ? 'black' : ''"
                  >
                    <v-icon small left>mdi-checkbox-marked-circle</v-icon>
                    Running
                  </v-chip>
                </td>
                <td v-else>
                  <v-chip
                    small
                    color="error"
                    :text-color="darkMode ? 'black' : ''"
                  >
                    <v-icon small left>mdi-checkbox-marked-circle</v-icon>
                    Stopped
                  </v-chip>
                </td>
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
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters(["darkMode"]),
  },
  created() {
    axios
      .get(new URL(config.apiURL + "/../status"))
      .then((resp) => (this.status = resp.data));
  },
};
</script>
