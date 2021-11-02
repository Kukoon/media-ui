<template>
  <v-menu
    v-if="sources"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        outlined
        class="float-right"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>
          mdi-download
        </v-icon>
        Download
      </v-btn>
    </template>
    <v-list flat>
      <v-subheader v-if="videos.length>0">
        Video
      </v-subheader>
      <v-list-item
        v-for="(item, index) in videos"
        :key="index"
        dense
        :href="item.url"
        target="_blank"
        download
      >
        <v-list-item-title>{{ item.resolution }}</v-list-item-title>
      </v-list-item>
      <v-divider v-if="videos.length > 0 && audios.length > 0" />
      <v-subheader v-if="audios.length > 0">
        Audio
      </v-subheader> 
      <v-list-item
        v-for="(item, index) in audios"
        :key="index"
        dense
        :href="item.url"
        target="_blank"
        download
      >
        <v-list-item-title>{{ item.resolution }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
	name: "BTNVideoDescription",
	props: ["sources"],
	computed: {
		videos() {
			return this.sources.filter((v)=>v.is_video)
		},
		audios() {
			return this.sources.filter((v)=>!v.is_video)
		},
	},
};
</script>
