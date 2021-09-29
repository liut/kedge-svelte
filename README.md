# kedge-svelte

A webui for kedge.

![screen.png](static/screen-w39.png)

## Features

* List all torrents
* Realtime sync stats of torrents
* Delelet a torrent (with data optional)
* Post a torrent file to add

## TODO

* Add support magnet
* General configurability

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
