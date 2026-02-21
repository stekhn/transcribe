import React, { useState } from "react";
import { Group, Button, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Modal } from "./Modal";
import { AudioRecorder } from "./AudioRecorder";
import { SAMPLING_RATE, DEFAULT_AUDIO_URL } from "../config";

const UrlInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => {
  const { size, ...restProps } = props; // Remove size to avoid conflict with Mantine
  return (
    <form tabIndex={0}>
      <TextInput
        type='url'
        placeholder='www.example.com'
        required
        h={44}
        mt='xs'
        mb='md'
        {...restProps}
      />
    </form>
  );
};

interface TileProps {
  icon: React.ReactElement;
  text: string;
  ariaLabel?: string;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({
  icon,
  text,
  ariaLabel,
  onClick,
}) => {
  return (
    <Button
      variant='default'
      className='source-tile'
      onClick={onClick}
      aria-label={ariaLabel}
      h={40}
      style={{ flex: "1 1 180px" }}
    >
      <Group gap='0.25rem' wrap='nowrap'>
        {icon}
        <Text>{text}</Text>
      </Group>
    </Button>
  );
};

interface UrlTileProps {
  icon: React.ReactElement;
  text: string;
  ariaLabel?: string;
  onUrlUpdate: (url: string) => void;
}

export const UrlTile: React.FC<UrlTileProps> = ({
  icon,
  text,
  ariaLabel,
  onUrlUpdate,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const onSubmit = (url: string) => {
    onUrlUpdate(url);
    close();
  };

  return (
    <>
      <Tile icon={icon} text={text} ariaLabel={ariaLabel} onClick={open} />
      <UrlModal opened={opened} onSubmit={onSubmit} onClose={close} />
    </>
  );
};

interface FileTileProps {
  icon: React.ReactElement;
  text: string;
  ariaLabel?: string;
  onFileUpdate: (
    decoded: AudioBuffer,
    blobUrl: string,
    mimeType: string,
  ) => void;
}

export const FileTile: React.FC<FileTileProps> = ({
  icon,
  text,
  ariaLabel,
  onFileUpdate,
}) => {
  // Create hidden input element
  let elem = document.createElement("input");
  elem.type = "file";
  elem.oninput = (event) => {
    // Make sure we have files to use
    let files = (event.target as HTMLInputElement).files;
    if (!files) return;

    // Create a blob that we can use as an src for our audio element
    const urlObj = URL.createObjectURL(files[0]);
    const mimeType = files[0].type;

    const reader = new FileReader();
    reader.addEventListener("load", async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer; // Get the ArrayBuffer
      if (!arrayBuffer) return;

      const audioCTX = new AudioContext({
        sampleRate: SAMPLING_RATE,
      });

      const decoded = await audioCTX.decodeAudioData(arrayBuffer);

      onFileUpdate(decoded, urlObj, mimeType);
    });
    reader.readAsArrayBuffer(files[0]);

    // Reset files
    elem.value = "";
  };

  return (
    <>
      <Tile
        icon={icon}
        text={text}
        ariaLabel={ariaLabel}
        onClick={() => elem.click()}
      />
    </>
  );
};

interface RecordTileProps {
  icon: React.ReactElement;
  text: string;
  ariaLabel?: string;
  setAudioData: (data: Blob) => void;
}

export const RecordTile: React.FC<RecordTileProps> = ({
  icon,
  text,
  ariaLabel,
  setAudioData,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const onSubmit = (data: Blob | undefined) => {
    if (data) {
      setAudioData(data);
      close();
    }
  };

  return (
    <>
      <Tile icon={icon} text={text} ariaLabel={ariaLabel} onClick={open} />
      <RecordModal opened={opened} onSubmit={onSubmit} onClose={close} />
    </>
  );
};

interface UrlModalProps {
  opened: boolean;
  onSubmit: (url: string) => void;
  onClose: () => void;
}

const UrlModal: React.FC<UrlModalProps> = ({ opened, onSubmit, onClose }) => {
  const [url, setUrl] = useState(DEFAULT_AUDIO_URL);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = () => onSubmit(url);

  return (
    <Modal
      opened={opened}
      title={"From URL"}
      content={
        <>
          {"Enter the URL of the audio file you want to load"}
          <UrlInput onChange={handleChange} value={url} />
        </>
      }
      onClose={onClose}
      submitText={"Load"}
      onSubmit={handleSubmit}
    />
  );
};

interface RecordModalProps {
  opened: boolean;
  onSubmit: (data: Blob | undefined) => void;
  onClose: () => void;
}

const RecordModal: React.FC<RecordModalProps> = ({
  opened,
  onSubmit,
  onClose,
}) => {
  const [audioBlob, setAudioBlob] = useState<Blob>();

  const onRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const handleSubmit = () => {
    onSubmit(audioBlob);
    setAudioBlob(undefined);
  };

  const handleClose = () => {
    onClose();
    setAudioBlob(undefined);
  };

  return (
    <Modal
      opened={opened}
      title={"From Recording"}
      content={
        <>
          {"Record audio using your microphone"}
          <AudioRecorder onRecordingComplete={onRecordingComplete} />
        </>
      }
      onClose={handleClose}
      submitText={"Load"}
      submitDisabled={audioBlob === undefined}
      onSubmit={handleSubmit}
    />
  );
};
