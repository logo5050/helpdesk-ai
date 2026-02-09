export const runtime = 'edge';

import { getSecurityAssessment, parseSecurityResponse } from '@/lib/claude';
import type { SecurityAssessRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SecurityAssessRequest;

    if (!body.flags || body.flags.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one security flag is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const rawResponse = await getSecurityAssessment(body);
    const parsed = parseSecurityResponse(rawResponse);

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Security assess API error:', error);

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
