<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center counter my-3">{{ counterDisplay }}</div>
    </div>
    <div class="row">
      <div class="col-12 text-center buttons my-3">
        <button
          v-if="!started"
          type="button"
          class="btn btn-primary"
          @click="start"
        >
          Start
        </button>
        <button
          v-else-if="running"
          type="button"
          class="btn btn-success"
          @click="pause"
        >
          Pause
        </button>
        <button v-else type="button" class="btn btn-primary" @click="resume">
          Resume
        </button>
        <button
          v-if="started"
          type="button"
          class="btn btn-secondary"
          @click="next"
        >
          Next
        </button>
        <button type="button" class="btn btn-danger" @click="reset">
          Reset
        </button>
      </div>
    </div>
    <div class="row options">
      <div class="col-sm form-group">
        <label>Work duration</label>
        <select v-model="workDuration" class="form-control">
          <option
            v-for="item in workDurations"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
      <div class="col-sm form-group">
        <label>Short break duration</label>
        <select v-model="breakDuration" class="form-control">
          <option
            v-for="item in breakDurations"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
      <div class="col-sm form-group">
        <label>Long break duration</label>
        <select v-model="longBreakDuration" class="form-control">
          <option
            v-for="item in longBreakDurations"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
      <div class="col-sm form-group">
        <label>Cycle between long break</label>
        <select v-model="longBreakDistance" class="form-control">
          <option
            v-for="item in longBreakDistances"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="row history">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="col-6"
        :class="{
          green: item.type === 'work',
          yellow: item.type === 'short_break',
          red: item.type === 'long_break',
        }"
      >
        {{ getType(item.type) }} ({{ item.duration }}s)
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { padStart } from "lodash";

export const ItemType = {
  work: "work",
  shortBreak: "short_break",
  longBreak: "long_break",
};

export interface IPomodoroItem {
  id: number;
  type: "work" | "short_break" | "long_break";
  duration: number;
  remaining: number;
  created: number;
  startTime?: number;
  endTime?: number;
  completed?: boolean;
}

@Component({
  name: "App",
})
export default class App extends Vue {
  private readonly workDurations = [
    { value: 1 * 60, label: "1m" },
    { value: 15 * 60, label: "15m" },
    { value: 20 * 60, label: "20m" },
    { value: 25 * 60, label: "25m" },
    { value: 30 * 60, label: "30m" },
    { value: 45 * 60, label: "45m" },
  ];
  private readonly breakDurations = [
    { value: 30, label: "30s" },
    { value: 3 * 60, label: "3m" },
    { value: 4 * 60, label: "4m" },
    { value: 5 * 60, label: "5m" },
    { value: 6 * 60, label: "6m" },
    { value: 7 * 60, label: "7m" },
  ];
  private readonly longBreakDurations = [
    { value: 1 * 60, label: "1m" },
    { value: 10 * 60, label: "10m" },
    { value: 15 * 60, label: "15m" },
    { value: 20 * 60, label: "20m" },
    { value: 25 * 60, label: "25m" },
    { value: 30 * 60, label: "30m" },
    { value: 35 * 60, label: "35m" },
  ];
  private readonly longBreakDistances = [
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
  ];

  // private workDuration = 1500;
  // private breakDuration = 300;
  // private longBreakDuration = 900;
  // private longBreakDistance = 4;

  private workDuration = 60;
  private breakDuration = 30;
  private longBreakDuration = 60;
  private longBreakDistance = 4;

  private items: IPomodoroItem[] = [];

  private speed = 10;
  private interval = 0;

  private started = false;
  private running = false;

  public mounted(): void {
    return;
  }

  public reset(): void {
    return;
  }

  public start(): void {
    console.log("Start");
    this.started = true;
    this.next();
  }

  public pause(): void {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = 0;
    this.running = false;
    document.title = `🔴(${this.counterDisplay})`;
  }

  public resume(): void {
    if (this.running) return;
    this.run();
  }

  private next(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
    const lastItem = this.currentItem;

    // Work if new or have completed break
    if (!lastItem || lastItem.type !== "work") {
      const item: IPomodoroItem = {
        id: this.items.length + 1,
        type: "work",
        duration: this.workDuration,
        remaining: this.workDuration,
        created: Date.now(),
      };
      this.items.push(item);
      // Break
    } else if (this.cycleCount < this.longBreakDistance) {
      const item: IPomodoroItem = {
        id: this.items.length + 1,
        type: "short_break",
        duration: this.breakDuration,
        remaining: this.breakDuration,
        created: Date.now(),
      };
      this.items.push(item);
      // Long break
    } else {
      const item: IPomodoroItem = {
        id: this.items.length + 1,
        type: "long_break",
        duration: this.longBreakDuration,
        remaining: this.longBreakDuration,
        created: Date.now(),
      };
      this.items.push(item);
    }

    this.run();
  }

  private run(): void {
    const current = this.currentItem;
    if (!current) return;
    this.running = true;

    current.startTime =
      Date.now() - ((current.duration - current.remaining) * 1000) / this.speed;

    this.interval = setInterval(() => {
      if (!current.startTime) return;
      const elapsed = ((Date.now() - current.startTime) / 1000) * this.speed;
      current.remaining = current.duration - elapsed;
      console.log(elapsed, current.remaining);
      if (current.remaining <= 0) {
        current.completed = true;
        current.endTime = Date.now();
        console.log("End: ", (current.created - current.endTime) / 1000);
        clearInterval(this.interval);
        this.interval = 0;
        this.running = false;
        this.next();
      }
      document.title = `🟢(${current.type}) - ${this.counterDisplay}`;
    }, 250);
  }

  private get currentItem(): IPomodoroItem | null {
    return this.items && this.items.length > 0
      ? this.items[this.items.length - 1]
      : null;
  }

  private get cycleCount(): number {
    let count = 0;
    for (let i = this.items.length - 1; i >= 0; i--) {
      // console.log()
      const item = this.items[i];
      if (item.type === "work") count++;
      if (item.type === "long_break") break;
    }
    return count;
  }

  public get counterDisplay(): string {
    if (!this.currentItem) return "00:00";
    const counter = this.currentItem.remaining;
    const minutes = Math.floor(counter / 60);
    const seconds = Math.floor(counter - minutes * 60);
    const displayMinutes = padStart(String(minutes), 2, "0");
    const displaySeconds = padStart(String(seconds), 2, "0");

    return `${displayMinutes}:${displaySeconds}`;
  }

  private getType(type: string): string {
    const map = {
      work: "Work",
      short_break: "Break",
      long_break: "Long break",
    };

    return map[type] || "";
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container .counter {
  font-size: 100px;
}
.buttons {
  .btn {
    margin: 0 10px;
  }
}

.history {
  .green {
    color: #0af;
  }
  .yellow {
    color: yellow;
  }
  .red {
    color: red;
  }
}
</style>
