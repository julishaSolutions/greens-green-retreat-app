'use server';
/**
 * @fileOverview A flow for converting text to speech using a Genkit TTS model.
 *
 * - generateSpeech - A function that takes text and returns a WAV audio data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

const GenerateSpeechInputSchema = z.string();
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (textToSpeak) => {
    // Generate the raw audio data from the TTS model.
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A pleasant, professional voice
          },
        },
      },
      prompt: textToSpeak,
    });

    if (!media) {
      throw new Error('No audio media was returned from the TTS model.');
    }
    
    // The model returns PCM data as a Base64 string within a data URI.
    // We need to extract it and convert it to a WAV file format.
    const pcmDataBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavData = await convertPcmToWav(pcmDataBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);

/**
 * Converts raw PCM audio data into a WAV format Base64 string.
 * @param pcmData - The raw audio buffer.
 * @param channels - Number of audio channels. Defaults to 1.
 * @param rate - The sample rate. Defaults to 24000 (standard for Gemini TTS).
 * @param sampleWidth - The sample width in bytes. Defaults to 2.
 * @returns A promise that resolves to the Base64 encoded WAV data.
 */
async function convertPcmToWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const buffers: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => {
      buffers.push(chunk);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(buffers).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
