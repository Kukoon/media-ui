<template>
  <v-dialog :value="true" width="290">
    <v-tabs v-model="tabs" fixed-tabs background-color="primary darken-2">
      <v-tab> Date </v-tab>
      <v-tab> Time </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-reverse-transition>
        <v-tab-item>
          <v-date-picker
            v-model="date"
            scrollable
            color="primary"
            :min="dateTimeObj.min"
          >
          </v-date-picker>
        </v-tab-item>
      </v-tab-reverse-transition>
      <v-tab-reverse-transition>
        <v-tab-item>
          <v-time-picker
            v-model="time"
            scrollable
            format="24hr"
            color="primary"
          >
          </v-time-picker>
        </v-tab-item>
      </v-tab-reverse-transition>
    </v-tabs-items>
    <v-divider />
    <v-card-actions class="neutral lighten-1">
      <v-spacer />
      <v-btn text @click="closeHandler()"> Cancel </v-btn>
      <v-btn text color="success" @click="saveHandler()"> Save </v-btn>
    </v-card-actions>
  </v-dialog>
</template>

<script>
export default {
  name: "DateTimePicker",
  props: ["stream", "dateTimeObj"],
  data() {
    return {
      tabs: 0,
    };
  },
  computed: {
    date: {
      get() {
        return this.dateTimeObj.date;
      },
      set(date) {
        this.$emit("changeDate", date);
      },
    },
    time: {
      get() {
        return this.dateTimeObj.time;
      },
      set(time) {
        this.$emit("changeTime", time);
      },
    },
  },
  methods: {
    closeHandler() {
      this.$emit("close");
    },
    saveHandler() {
      this.$emit("save");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-picker__title {
  max-height: 88px !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
::v-deep .theme--dark.v-picker__body {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background: var(--v-neutral-lighten2) !important;
}
::v-deep .theme--dark.v-time-picker-clock {
  background: var(--v-neutral-lighten3) !important;
}
</style>