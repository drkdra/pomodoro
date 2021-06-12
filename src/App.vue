<template>
  <div>
    <Player :src="source" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Player from "./components/Player.vue";

@Component({
  components: {
    Player,
  },
})
export default class App extends Vue {
  private source = "QYbvmMp0IMc";
}
</script>

<style class="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
