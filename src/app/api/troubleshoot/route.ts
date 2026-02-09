export const runtime = 'edge';

import { streamTroubleshootResponse } from '@/lib/claude';
import type { TroubleshootRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TroubleshootRequest;

    if (!body.category || !body.description) {
      return new Response(
        JSON.stringify({ error: 'Category and description are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const stream = await streamTroubleshootResponse(body);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Troubleshoot API error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    const isApiKeyError =
      errorMessage.includes('API key') ||
      errorMessage.includes('ANTHROPIC_API_KEY');

    return new Response(
      JSON.stringify({
        error: isApiKeyError
          ? 'API key not configured. Please set the ANTHROPIC_API_KEY environment variable.'
          : errorMessage,
      }),
      {
        status: isApiKeyError ? 401 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
