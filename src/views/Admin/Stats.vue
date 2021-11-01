<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Statistics</h3>
        <v-divider class="mt-2" />
        <v-expansion-panels accordion tile class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span>Graph Source</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card tile elevation="0" class="pa-0">
                <v-card-text class="pa-0 d-flex flex-column justify-end">
                  <v-row no-gutters>
                    <v-text-field
                      :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                      outlined
                      dense
                      label="URL"
                      hide-details
                    />
                  </v-row>
                </v-card-text>
                <v-card-actions class="px-0 pt-4">
                  <v-btn class="ml-auto" color="primary lighten-3">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card tile class="mt-4">
          <v-card-title />
          <v-card-subtitle />
          <v-card-text>
            <!-- <v-sparkline
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="value"
              auto-draw
            ></v-sparkline> -->
            <v-btn @click="printInfo"> Print Info </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Statistics",
  data() {
    return {
      data: null,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  mounted() {
    axios
      .get(
        "https://monitoring.sum7.eu/api/v1/query_range?query=sum%28rate%28traefik_service_requests_total%7Bexported_service%3D%22rtmp-v2%40file%22%7D%5B5m%5D%29%29&start=1612990985.782&end=1612994585.782&step=14"
      )
      .then((response) => (this.info = response));
  },
  methods: {
    printInfo() {
      console.log(this.info);
    },
  },
};
</script>