export const SAMPLING_RATE = 16000;
export const DEFAULT_AUDIO_URL = `https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60_16k.wav`;
export const DEFAULT_SUBTASK = "transcribe";
export const DEFAULT_QUANTIZED = false;
export const DEFAULT_MULTILINGUAL = true;

export const DEFAULT_MODEL = "onnx-community/whisper-tiny";

export const MODELS: { [key: string]: number } = {
    "onnx-community/whisper-tiny": 120,
    "onnx-community/whisper-base": 206,
    "onnx-community/whisper-small": 586,
};

export const DEFAULT_LANGUAGE = "en";

// List of supported languages: https://github.com/openai/whisper/blob/248b6cb124225dd263bb9bd32d060b6517e067f8/whisper/tokenizer.py#L79
export const LANGUAGES: { [key: string]: string } = {
    sq: "albanian",
    ar: "arabic",
    bs: "bosnian",
    bg: "bulgarian",
    zh: "chinese",
    hr: "croatian",
    cs: "czech",
    da: "danish",
    nl: "dutch",
    en: "english",
    fi: "finnish",
    fr: "french",
    de: "german",
    el: "greek",
    he: "hebrew",
    hi: "hindi",
    hu: "hungarian",
    id: "indonesian",
    it: "italian",
    ja: "japanese",
    ko: "korean",
    lb: "luxembourgish",
    no: "norwegian",
    ps: "pashto",
    fa: "persian",
    pl: "polish",
    pt: "portuguese",
    ro: "romanian",
    ru: "russian",
    sr: "serbian",
    sk: "slovak",
    sl: "slovenian",
    es: "spanish",
    sv: "swedish",
    th: "thai",
    tr: "turkish",
    uk: "ukrainian",
    vi: "vietnamese",
};
