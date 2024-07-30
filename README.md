# Transcribe

Use Whisper speech-to-text models directly in your browser. Built with [Transformers.js](https://github.com/xenova/transformers.js), based on the [Whisper Web](https://github.com/xenova/whisper-web/).

**Live Demo**: <https://stekhn.github.io/transcribe/>

## Usage

1. Clone the repository `git clone git@github.com:stekhn/transcribe.git`
2. Install dependencies `npm install`
3. Start development server `npm run dev`
4. Build the website `npm run build`

The project requires [Node.js](https://nodejs.org/en/download/) to run locally. The development server runs on <http://localhost:5173/>.

Firefox users might need to change the `dom.workers.modules.enabled` setting in `about:config` to `true` to enable Web Workers. Check out [this issue](https://github.com/xenova/whisper-web/issues/8) for more details.

## Deployment

Create a production build of the web application:

```shell
npm run build
```

By default, the build output will be placed in the folder `./dist`.

Add the `./dist` folder to Git:

```shell
git add dist -f
```

`-f` is required, since the `./dist` folder is excluded from Git by the `.gitignore` file. So, we need to force it.

Create a commit:

```shell
git commit -m "Adding build"
```

Push your local changes to Github:

```shell
git subtree push --prefix dist origin gh-pages
```
