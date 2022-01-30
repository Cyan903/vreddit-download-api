# vreddit-download-api

![code size](https://img.shields.io/github/languages/code-size/CyanPiano/vreddit-download-api) ![total lines](https://img.shields.io/tokei/lines/github/CyanPiano/vreddit-download-api) ![last commit](https://img.shields.io/github/last-commit/CyanPiano/vreddit-download-api)

Created mainly for the frontend, but I thought this api would be better in it's own repo. Serves as a way to get direct links to video and audio downloads from `v.redd.it`. I might rewrite this in a different framework or language sometime...

Now relies on redis for less requests to `reddit.com` and faster responses. Editing redis options can be done in the `config.json` file. For an explanation, look in the `config.sample.json` file.

#### To setup...
```
$ pnpm i
$ mkdir public/output
$ redis-server
$ nano config.json
$ pnpm start
```

#### To build...
```
$ pnpm run build
$ pnpm run app # assuming redis is running
```

Docs are in the [docs](https://github.com/CyanPiano/vreddit-download-api/blob/main/DOCS.md) markdown.