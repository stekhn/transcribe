import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Anchor,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { Logo } from "./components/Icons";
import { InfoButton } from "./components/InfoButton";
import { AudioManager } from "./components/AudioManager";
import { Transcript } from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

export const App: React.FC = () => {
  const transcriber = useTranscriber();

  return (
    <Stack align='center' p='md' mih='100vh'>
      <Container size='sm' p='md'>
        <Group justify='center' gap='sm' mb='md'>
          <Logo
            style={{
              width: "2.5rem",
              height: "2.5rem",
              fill: "var(--mantine-color-blue-6)",
            }}
          />
          <Title
            order={1}
            fw={800}
            ta='center'
            fz='clamp(2rem, 5vw, 3rem)'
            lts='-0.025em'
          >
            Transcribe
          </Title>
        </Group>
        <Text
          size='xl'
          fw={600}
          ta='center'
          fz='clamp(1.125rem, 3vw, 1.25rem)'
          lts='-0.025em'
          lh='1'
        >
          Use Whisper speech-to-text models directly in your browser.
          Privacy-focused and free.{" "}
          <InfoButton
            icon={<IconInfoCircle style={{ cursor: "pointer" }} />}
            content={<ContentInfo />}
          />
        </Text>
      </Container>

      <Container size='sm' w='100%'>
        <Paper shadow='xl' radius='md' p='md'>
          <AudioManager transcriber={transcriber} />
        </Paper>
      </Container>

      {transcriber.output && (
        <Container size='sm' w='100%'>
          <Paper shadow='xl' radius='md' p='md'>
            <Transcript transcriber={transcriber} />
          </Paper>
        </Container>
      )}
    </Stack>
  );
};

const ContentInfo: React.FC = () => {
  return (
    <Stack gap='md'>
      <Text>
        This prototype demonstrates the potential of local AI models for
        speech-to-text transcription, offering a cost-effective and
        privacy-friendly solution. Running directly in the browser, it
        eliminates the need for complicated setups or expensive services.
        However, transcription can be slow when using larger models.
      </Text>
      <Text>
        Transcribe is based on{" "}
        <Anchor
          href='https://github.com/xenova/whisper-web/'
          target='_blank'
          rel='nofollow'
          underline='always'
        >
          Whisper Web
        </Anchor>
        , built with{" "}
        <Anchor
          href='https://github.com/xenova/transformers.js'
          target='_blank'
          rel='nofollow'
          underline='always'
        >
          Transformers.js
        </Anchor>
        , using{" "}
        <Anchor
          href='https://onnx.ai/'
          target='_blank'
          rel='nofollow'
          underline='always'
        >
          ONNX Whisper
        </Anchor>{" "}
        models from{" "}
        <Anchor
          href='https://huggingface.co/models?sort=downloads&amp;search=onnx+whisper'
          target='_blank'
          rel='nofollow'
          underline='always'
        >
          Hugging Face
        </Anchor>
        .{" "}
        <Anchor
          href='https://github.com/openai/whisper'
          target='_blank'
          rel='nofollow'
          underline='always'
        >
          Whisper
        </Anchor>{" "}
        is a open-source speech recognition model developed by OpenAI.
      </Text>
      <Text>
        If you'd like to support this project, consider donating to{" "}
        <Anchor
          href='https://github.com/sponsors/xenova'
          target='_blank'
          rel='nofollow'
          underline='always'
        >
          Joshua Lochner (xenova)
        </Anchor>
        , the creator of Transformers.js and many cool, browser-based AI demos.
      </Text>
      <Text>
        Check out this application's code on{" "}
        <Anchor
          href='https://github.com/stekhn/transcribe/'
          target='_blank'
          underline='always'
        >
          Github
        </Anchor>
        .
      </Text>
    </Stack>
  );
};
