import axios from "axios";

import { SAMPLING_RATE } from "../config";

export enum AudioSource {
  URL = "URL",
  FILE = "FILE",
  RECORDING = "RECORDING",
}

export const resetAudio = (
  setAudioData: React.Dispatch<React.SetStateAction<any>>,
  setAudioDownloadUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
) => {
  setAudioData(undefined);
  setAudioDownloadUrl(undefined);
};

export const setAudioFromDownload = async (
  data: ArrayBuffer,
  mimeType: string,
  setAudioData: React.Dispatch<React.SetStateAction<any>>,
) => {
  const audioCTX = new AudioContext({
    sampleRate: SAMPLING_RATE,
  });
  const blobUrl = URL.createObjectURL(new Blob([data], { type: "audio/*" }));
  const decoded = await audioCTX.decodeAudioData(data);
  setAudioData({
    buffer: decoded,
    url: blobUrl,
    source: AudioSource.URL,
    mimeType: mimeType,
  });
};

export const setAudioFromRecording = async (
  data: Blob,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setAudioData: React.Dispatch<React.SetStateAction<any>>,
) => {
  resetAudio(setAudioData, () => {});
  setProgress(0);
  const blobUrl = URL.createObjectURL(data);
  const fileReader = new FileReader();
  fileReader.onprogress = (event) => {
    setProgress(event.loaded / event.total || 0);
  };
  fileReader.onloadend = async () => {
    const audioCTX = new AudioContext({
      sampleRate: SAMPLING_RATE,
    });
    const arrayBuffer = fileReader.result as ArrayBuffer;
    const decoded = await audioCTX.decodeAudioData(arrayBuffer);
    setAudioData({
      buffer: decoded,
      url: blobUrl,
      source: AudioSource.RECORDING,
      mimeType: data.type,
    });
  };
  fileReader.readAsArrayBuffer(data);
};

export const downloadAudioFromUrl = async (
  audioDownloadUrl: string | undefined,
  requestAbortController: AbortController,
  setAudioData: React.Dispatch<React.SetStateAction<any>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setAudioFromDownload: (data: ArrayBuffer, mimeType: string) => Promise<void>,
) => {
  if (audioDownloadUrl) {
    try {
      setAudioData(undefined);
      setProgress(0);
      const { data, headers } = (await axios.get(audioDownloadUrl, {
        signal: requestAbortController.signal,
        responseType: "arraybuffer",
        onDownloadProgress(progressEvent) {
          setProgress(progressEvent.progress || 0);
        },
      })) as {
        data: ArrayBuffer;
        headers: { "content-type": string };
      };

      let mimeType = headers["content-type"];
      if (!mimeType || mimeType === "audio/wave") {
        mimeType = "audio/wav";
      }
      await setAudioFromDownload(data, mimeType);
    } catch (error) {
      if (axios.isCancel(error)) return;
      throw error;
    }
  }
};
