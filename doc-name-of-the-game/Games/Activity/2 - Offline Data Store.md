To access the App on your phone I would recommend running the App outside of the devcontainer. You can just run the the `postCreateCommand` and the `postStartCommand` from the devcontainer.json or just `npm install` and `npm run dev`. Then you need to access an IP that looks like this `192.168.178.43:5173`.

# Test if current App is a PWA
```ts
isPWA.value = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
```
# `wordListHelper.ts`
I created a helper, that gets the word list either from the public folder or from the `IndexedDB`. If it is a PWA and nothing is saved to the `IndexedDB` it will store it there.
