import { parse } from 'node-html-parser';
import axios from 'axios';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';

export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] ${message}`);
  }
}

const fetchTranscript = async (
  identifier: string,
  config: { lang?: string } = {}
) => {
  //   const identifier = retrieveVideoId(videoId);
  const lang = config?.lang ?? 'en';
  try {
    const transcriptUrl = await axios
      .get(`https://www.youtube.com/watch?v=${identifier}`, {
        headers: {
          'User-Agent': USER_AGENT,
        },
      })
      .then((res) => res.data)
      .then((html) => parse(html))
      .then((html) => parseTranscriptEndpoint(html, lang));

    if (!transcriptUrl)
      throw new Error('Failed to locate a transcript for this video!');

    const transcriptXML = await axios
      .get(transcriptUrl)
      .then((res) => res.data)
      .then((xml) => parse(xml));

    let transcript = '';
    const chunks = transcriptXML.getElementsByTagName('text');
    for (const chunk of chunks) {
      transcript += chunk.textContent + ' ';
    }

    return transcript.trim();
  } catch (e: any) {
    throw new YoutubeTranscriptError(e.message);
  }
};

const parseTranscriptEndpoint = (
  document: any,
  langCode: string | null = null
) => {
  try {
    const scripts = document.getElementsByTagName('script');
    const playerScript = scripts.find((script: any) =>
      script.textContent.includes('var ytInitialPlayerResponse = {')
    );

    const dataString =
      playerScript.textContent
        ?.split('var ytInitialPlayerResponse = ')?.[1]
        ?.split('};')?.[0] + '}';

    const data = JSON.parse(dataString.trim());
    const availableCaptions =
      data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

    let captionTrack = availableCaptions?.[0];
    if (langCode) {
      captionTrack =
        availableCaptions.find((track: any) =>
          track.languageCode.includes(langCode)
        ) ?? availableCaptions?.[0];
    }

    return captionTrack?.baseUrl;
  } catch (e: any) {
    console.error(`YoutubeTranscript.#parseTranscriptEndpoint ${e.message}`);
    return null;
  }
};

const extractVideoID = (url: string): string | null => {
  const regex =
    // eslint-disable-next-line no-useless-escape
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/\s*|v\/|e(?:mbed)?\/|\S*?watch(?:\S+)?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : null;
};

const retrieveTranscript = async (url: string): Promise<string> => {
  try {
    const videoId = extractVideoID(url);

    if (videoId) {
      const transcript = await fetchTranscript(videoId);
      return transcript;
    }

    console.error('An error occurred while retrieving the transcript');
    throw new Error('An error occurred while retrieving the transcript');
  } catch (e) {
    console.error(e);
    throw new Error('An error occurred while retrieving the transcript');
  }
};

const YoutubeController = {
  retrieveTranscript,
};

export default YoutubeController;
