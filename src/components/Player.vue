<template>
  <div class="container-fluid y-player">
    <youtube :video-id="src" :host="host" :player-vars="options"></youtube>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "Player",
})
export default class Player extends Vue {
  @Prop(String) private readonly src!: string;

  private host = "https://www.youtube-nocookie.com";
  private options = {
    autoplay: 1,
    controls: 1,
    loop: 1,
    playlist: this.src,
  };

  private mounted(): void {
    return;
  }
}
// https://developers.google.com/youtube/player_parameters#IFrame_Player_API
</script>

<style lang="scss" scoped>
.y-player {
  // width: 100%;

  iframe {
    width: 50vw;
    height: 28.125vw;
  }
}
</style>
