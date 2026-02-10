/**
 * @jest-environment node
 */

import { POST } from '@/app/api/security-assess/route';

// Mock the claude module
jest.mock('@/lib/claude', () => ({
  getSecurityAssessment: jest.fn(),
  parseSecurityResponse: jest.fn(),
}));

import { getSecurityAssessment, parseSecurityResponse } from '@/lib/claude';

const mockGetSecurityAssessment = getSecurityAssessment as jest.Mock;
const mockParseSecurityResponse = parseSecurityResponse as jest.Mock;

describe('POST /api/security-assess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when description is missing', async () => {
    const request = new Request('http://localhost/api/security-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Please describe the caller interaction');
  });

  it('returns 400 when description is empty', async () => {
    const request = new Request('http://localhost/api/security-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: '   ' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Please describe the caller interaction');
  });

  it('returns parsed security assessment on success', async () => {
    const mockRawResponse = 'Raw AI response text';
    const mockParsedResponse = {
      riskScore: 7,
      riskLevel: 'HIGH',
      assessment: 'High risk detected',
      supervisorNotification: 'Alert text',
      ticketDocumentation: 'Ticket text',
    };

    mockGetSecurityAssessment.mockResolvedValue(mockRawResponse);
    mockParseSecurityResponse.mockReturnValue(mockParsedResponse);

    const request = new Request('http://localhost/api/security-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Caller was aggressive and refused to verify identity',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockParsedResponse);
    expect(mockGetSecurityAssessment).toHaveBeenCalledWith({
      description: 'Caller was aggressive and refused to verify identity',
    });
    expect(mockParseSecurityResponse).toHaveBeenCalledWith(mockRawResponse);
  });

  it('returns 401 when API key is not configured', async () => {
    mockGetSecurityAssessment.mockRejectedValue(
      new Error('ANTHROPIC_API_KEY environment variable is not set')
    );

    const request = new Request('http://localhost/api/security-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Test description',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('API key not configured');
  });

  it('returns 500 on other errors', async () => {
    mockGetSecurityAssessment.mockRejectedValue(
      new Error('Some other error')
    );

    const request = new Request('http://localhost/api/security-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Test description',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Some other error');
  });
});
