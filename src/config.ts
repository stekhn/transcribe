export const SAMPLING_RATE = 16000;
export const DEFAULT_AUDIO_URL =
    "https://archive.org/download/Greatest_Speeches_of_the_20th_Century/AddresstotheWomenofAmerica.mp3";
export const DEFAULT_SUBTASK = "transcribe";
export const DEFAULT_WEBGPU = false;
export const DEFAULT_MULTILINGUAL = true;

export const DEFAULT_MODEL = "onnx-community/whisper-base";

export const MODELS: { [key: string]: number } = {
    "onnx-community/whisper-tiny": 65,
    "onnx-community/whisper-base": 101,
    "onnx-community/whisper-small": 273,
    // "onnx-community/whisper-tiny.en": 65,
    // "onnx-community/whisper-base.en": 101,
    // "onnx-community/whisper-small.en": 273,
    "distil-whisper/distil-small.en": 196,
    "distil-whisper/distil-medium.en": 426,
};

export const DEFAULT_LANGUAGE = "english";

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
