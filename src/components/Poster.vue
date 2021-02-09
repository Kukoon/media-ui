<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-img
        v-ripple="{ class: 'neutral--text', center: true }"
        :src="source"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
        height="100%"
        width="100%"
      >
        <v-fade-transition>
          <v-overlay v-if="hover" absolute color="accent darken-3">
            <v-btn :ripple="false" icon x-large id="no-background-hover">
              <v-icon x-large> mdi-play </v-icon>
            </v-btn>
          </v-overlay>
        </v-fade-transition>
      </v-img>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: "Poster",
  props: ["source"],
};
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
</style>