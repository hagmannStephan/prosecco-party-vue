# Create Vue / Vite App

```sh
npm create vite@latest name-of-the-game-vue -- --template vue
cd .\name-of-the-game-vue\
npm install
```

# Run the App on the Network

## Modify `vite.config.ts`

```ts
export default defineConfig({
  plugins: [vue()],
  // Add this part
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
```

## Run the App

```sh
npm run dev -- --host
```

# Enable ESLint and Prettier

I followed this tutorial from [geeks for geeks](https://www.geeksforgeeks.org/how-to-set-up-vite-with-eslint-and-prettier/).

1. Install dependencies
2. Create files and add content
   However the tutorial seems to be a bit outdated and I needed to run the following commands for it to work after completing it:

```sh
npx  @eslint/migrate-config .eslintrc.json
npm install eslint-plugin-react@latest --save-dev
```

Now, with ==**`npm run lint`**== I can see the errors. With ==**`npm run format`**== I can fix them.

# Enable PWA Support

I followed this tutorial from [Vite PWA](https://vite-pwa-org.netlify.app/guide/) and just added the minimal Config.

# Enable Router

I followed this official tutorial from [vuejs](https://router.vuejs.org/installation.html)
