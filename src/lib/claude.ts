import Anthropic from '@anthropic-ai/sdk';
import { CYBERSECURITY_SYSTEM_PROMPT } from './prompts';
import type { SecurityAssessRequest } from './types';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
}

function getModelId(): string {
  return process.env.MODEL_ID || 'claude-haiku-4-5-20251001';
}

export async function getSecurityAssessment(
  request: SecurityAssessRequest
): Promise<string> {
  const client = getClient();
  const modelId = getModelId();

  const userMessage = `Caller Interaction Description:
${request.description}

Please analyze this interaction for potential social engineering or security threats. Extract any red flags from the description and provide a comprehensive risk assessment with documentation.`;

  const response = await client.messages.create({
    model: modelId,
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: CYBERSECURITY_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response received from Claude');
  }

  return textContent.text;
}

export function parseSecurityResponse(response: string): {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assessment: string;
  supervisorNotification: string;
  ticketDocumentation: string;
} {
  // Extract risk score
  const scoreMatch = response.match(/RISK SCORE[:\s]*(\d+)/i) ||
    response.match(/Score[:\s]*(\d+)\s*\/\s*10/i) ||
    response.match(/(\d+)\s*\/\s*10/);
  const riskScore = scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1], 10))) : 5;

  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  if (riskScore <= 3) riskLevel = 'LOW';
  else if (riskScore <= 6) riskLevel = 'MEDIUM';
  else riskLevel = 'HIGH';

  // Extract supervisor notification (between ``` blocks after "SUPERVISOR")
  const supervisorMatch = response.match(/SUPERVISOR[^`]*```([^`]+)```/is);
  const supervisorNotification = supervisorMatch
    ? supervisorMatch[1].trim()
    : 'Unable to parse supervisor notification.';

  // Extract ticket documentation (between ``` blocks after "TICKET" or "DOCUMENTATION")
  const ticketMatch = response.match(/(?:TICKET|DOCUMENTATION)[^`]*```([^`]+)```/is);
  const ticketDocumentation = ticketMatch
    ? ticketMatch[1].trim()
    : 'Unable to parse ticket documentation.';

  // Extract assessment (everything between RISK ASSESSMENT and SUPERVISOR)
  const assessmentMatch = response.match(/RISK ASSESSMENT[:\s]*\n([\s\S]*?)(?=\n\d+\.|SUPERVISOR|```)/i);
  const assessment = assessmentMatch
    ? assessmentMatch[1].trim()
    : response.substring(0, 500);

  return {
    riskScore,
    riskLevel,
    assessment,
    supervisorNotification,
    ticketDocumentation,
  };
}
