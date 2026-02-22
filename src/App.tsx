import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Logo } from "./components/Icons";
import { Modal } from "./components/Modal";
import { AudioManager } from "./components/AudioManager";
import { Transcript } from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

export const App: React.FC = () => {
  const transcriber = useTranscriber();
  const [aboutOpened, { open: openAbout, close: closeAbout }] =
    useDisclosure(false);
  const [helpOpened, { open: openHelp, close: closeHelp }] =
    useDisclosure(false);

  return (
    <Stack align='center' p='md' mih='100vh' gap='xl'>
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
            fw='bold'
            ta='center'
            fz='clamp(2rem, 5vw, 3rem)'
            lts='-0.025em'
          >
            Transcribe
          </Title>
        </Group>
        <Text
          size='xl'
          fw='bold'
          ta='center'
          fz='clamp(1.125rem, 3vw, 1.25rem)'
          lts='-0.025em'
          lh='1'
        >
          Use Whisper speech-to-text models directly in your browser.
          Privacy-focused and free.
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

      <Group gap='sm' mt='auto' pb='md'>
        <Anchor size='sm' c='dimmed' component='button' onClick={openAbout}>
          About
        </Anchor>
        <Text size='sm' c='dimmed'>
          |
        </Text>
        <Anchor size='sm' c='dimmed' component='button' onClick={openHelp}>
          Help
        </Anchor>
        <Text size='sm' c='dimmed'>
          |
        </Text>
        <Anchor
          size='sm'
          c='dimmed'
          href='https://github.com/stekhn/transcribe/'
          target='_blank'
        >
          Github
        </Anchor>
      </Group>

      <Modal
        opened={aboutOpened}
        title='About Transcribe'
        content={<ContentInfo />}
        onClose={closeAbout}
        onSubmit={() => {}}
      />
      <Modal
        opened={helpOpened}
        title='Help'
        content={<ContentHelp />}
        onClose={closeHelp}
        onSubmit={() => {}}
      />
    </Stack>
  );
};

const ContentInfo: React.FC = () => {
  return (
    <Stack gap='md'>
      <Text size='sm'>
        This prototype demonstrates the potential of local AI models for
        speech-to-text transcription, offering a cost-effective and
        privacy-friendly solution. Running directly in the browser, it
        eliminates the need for complicated setups or expensive services.
        However, transcription can be slow when using larger models.
      </Text>
      <Text size='sm'>
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
        is an open-source speech recognition model developed by OpenAI.
      </Text>
      <Text size='sm'>
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
    </Stack>
  );
};

const ContentHelp: React.FC = () => {
  return (
    <Stack gap='md'>
      <Text size='sm' fw='bold'>
        Transcription model
      </Text>
      <Text size='sm'>
        Choose between different Whisper model sizes. Bigger models produce
        better results but are slower to download and run. A filled circle next
        to a model means it has already been downloaded to your browser.
      </Text>
      <Text size='sm' fw='bold'>
        Source language
      </Text>
      <Text size='sm'>
        Select the language spoken in your audio or use auto-detect. Specifying
        the correct language can improve accuracy. English is best supported.
      </Text>
      <Text size='sm' fw='bold'>
        WebGPU support
      </Text>
      <Text size='sm'>
        Enables hardware-accelerated transcription using your GPU. This is
        faster but potentially unstable, as WebGPU support varies across
        browsers and devices.
      </Text>
      <Text size='sm' fw='bold'>
        Notifications
      </Text>
      <Text size='sm'>
        Sends a browser notification when the transcription is done, so you
        don't have to keep the tab in focus.
      </Text>
    </Stack>
  );
};
