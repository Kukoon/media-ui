<template>
  <div>
    <h1>Recordings</h1>
    <RecordingsGrid />
  </div>
</template>

<script>
import RecordingsGrid from "../components/RecordingsGrid";
export default {
  name: "Recordings",
  components: { RecordingsGrid },
};
</script>