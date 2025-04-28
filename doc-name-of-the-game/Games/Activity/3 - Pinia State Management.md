The Game Settings like amount of player etc. get saved with Pinia. QueryParams seem unfitting!
I followed [this tutorial](https://pinia.vuejs.org/getting-started.html) to setup the Pinia store. Afterwards I did this:
# Create the Store
1. Create File at `src/stores/activitySettingsStore.ts`
2. I imported the relevant data and created an interface:
```ts
interface GameSettings {
  players: string[];
  rounds: number;
  timePerRound: number;
  gameModes: string[];
}
```
3. Afterwards i define the store based on the interface with it's getters and setters. Because this is rather repetitive it is a great task for ChatGPT!
# Use the Store in `ActivityConfig.vue`
