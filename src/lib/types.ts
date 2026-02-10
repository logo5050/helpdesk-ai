export interface SecurityAssessRequest {
  description: string;
}

export interface SecurityAssessResponse {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assessment: string;
  supervisorNotification: string;
  ticketDocumentation: string;
}

export function getRiskLevelFromScore(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score <= 3) return 'LOW';
  if (score <= 6) return 'MEDIUM';
  return 'HIGH';
}

export function getRiskColor(level: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (level) {
    case 'LOW':
      return '#00E676';
    case 'MEDIUM':
      return '#FFB300';
    case 'HIGH':
      return '#FF3D57';
  }
}
