# Transcribe

Use Whisper speech-to-text models directly in your browser. Built with [Transformers.js](https://github.com/xenova/transformers.js), based on the [Whisper Web](https://github.com/xenova/whisper-web/) demo.

## Usage

1. Clone the repo and install dependencies:

    ```bash
    git clone https://github.com/xenova/whisper-web.git
    cd whisper-web
    npm install
    ```

2. Run the development server:

    ```bash
    npm run dev
    ```

    > Firefox users need to change the `dom.workers.modules.enabled` setting in `about:config` to `true` to enable Web Workers.
    > Check out [this issue](https://github.com/xenova/whisper-web/issues/8) for more details.

3. Open the link (e.g., [http://localhost:5173/](http://localhost:5173/)) in your browser.
