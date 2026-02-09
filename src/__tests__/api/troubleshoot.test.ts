/**
 * @jest-environment node
 */

import { POST } from '@/app/api/troubleshoot/route';

// Mock the claude module
jest.mock('@/lib/claude', () => ({
  streamTroubleshootResponse: jest.fn(),
}));

import { streamTroubleshootResponse } from '@/lib/claude';

const mockStreamTroubleshootResponse = streamTroubleshootResponse as jest.Mock;

describe('POST /api/troubleshoot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when category is missing', async () => {
    const request = new Request('http://localhost/api/troubleshoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Category and description are required');
  });

  it('returns 400 when description is missing', async () => {
    const request = new Request('http://localhost/api/troubleshoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Category and description are required');
  });

  it('returns streaming response on success', async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('Test response'));
        controller.close();
      },
    });

    mockStreamTroubleshootResponse.mockResolvedValue(mockStream);

    const request = new Request('http://localhost/api/troubleshoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Password Reset',
        description: 'User cannot login',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');

    const reader = response.body?.getReader();
    const { value } = await reader!.read();
    const text = new TextDecoder().decode(value);

    expect(text).toBe('Test response');
  });

  it('returns 401 when API key is not configured', async () => {
    mockStreamTroubleshootResponse.mockRejectedValue(
      new Error('ANTHROPIC_API_KEY environment variable is not set')
    );

    const request = new Request('http://localhost/api/troubleshoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Password Reset',
        description: 'User cannot login',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('API key not configured');
  });

  it('returns 500 on other errors', async () => {
    mockStreamTroubleshootResponse.mockRejectedValue(
      new Error('Some other error')
    );

    const request = new Request('http://localhost/api/troubleshoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Password Reset',
        description: 'User cannot login',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Some other error');
  });
});
