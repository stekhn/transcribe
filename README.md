# Transcribe

Use Whisper speech-to-text models directly in your browser. Privacy-focused and free.

This web application is based on [Whisper Web](https://github.com/xenova/whisper-web/), built with [Transformers.js](https://github.com/xenova/transformers.js), using [ONNX](https://onnx.ai/) models from [Hugging Face](https://huggingface.co/models?sort=downloads&search=onnx+whisper).

**Live Demo**: <https://stekhn.github.io/transcribe/>

## Usage

1. Clone the repository `git clone git@github.com:stekhn/transcribe.git`
2. Install dependencies `npm install`
3. Start development server `npm run dev`
4. Build the website `npm run build`

The project requires [Node.js](https://nodejs.org/en/download/) to run locally. The development server runs on <http://localhost:5173/transcribe/>.

Firefox users might need to change the `dom.workers.modules.enabled` setting in `about:config` to `true` to enable Web Workers. Check out [this issue](https://github.com/xenova/whisper-web/issues/8) for more details.

## Configuration

Configure the most important settings in the `./src/config.ts` file.

Update the list of available Whisper models and the default model:

```ts
export const DEFAULT_MODEL = "onnx-community/whisper-tiny";

export const MODELS: { [key: string]: number } = {
    "onnx-community/whisper-tiny": 120,
    "onnx-community/whisper-base": 206,
    "onnx-community/whisper-small": 586,
};
```

The numeric value is the size of the model in Megabytes. Models must be provided as [ONNX](https://onnx.ai/) files. You can find suitable ONNX Whisper models on [Hugging Face](https://huggingface.co/models?sort=downloads&search=onnx+whisper). [Optimum](https://github.com/onnx/tutorials) is a great tool for converting models to ONNX. Additionally, the ONNX community provides great [tutorials](https://github.com/onnx/tutorials) on how to create ONNX models from various machine learning frameworks.

Small warning: Using very large models (> 500 MB) will likely lead to memory issues.

Update the list of Whisper languages and update the default language:

```ts
export const DEFAULT_LANGUAGE = "en";

export const LANGUAGES: { [key: string]: string } = {
    en: "english",
    fr: "french",
    de: "german",
    es: "spanish",
};
```

See the [full list of supported languages](https://github.com/openai/whisper/blob/248b6cb124225dd263bb9bd32d060b6517e067f8/whisper/tokenizer.py#L79) by Whisper. Though, it must me said that smaller languages are not well supported by small Whisper models, resulting in bad speech recognition quality. For those smaller languages or if performance is key, you might want to look into [training your own Distil-Whisper model](https://github.com/huggingface/distil-whisper/tree/main/training).

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
git commit -m "Add build"
```

Push your local changes to Github:

```shell
git subtree push --prefix dist origin gh-pages
```
