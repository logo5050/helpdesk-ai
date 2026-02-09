import React from 'react';
import { render, screen } from '@testing-library/react';
import { RiskAssessment } from '@/components/RiskAssessment';

describe('RiskAssessment', () => {
  const defaultProps = {
    riskScore: 5,
    riskLevel: 'MEDIUM' as const,
    assessment: 'This is a test assessment with multiple concerning factors.',
    supervisorNotification: 'SECURITY ALERT - MEDIUM\nRisk Score: 5/10',
    ticketDocumentation: 'SECURITY CONCERN DOCUMENTED\nRisk Level: MEDIUM',
  };

  it('renders risk score and level', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    // Check for score label - may appear multiple times
    const scoreLabels = screen.getAllByText(/Score:/);
    expect(scoreLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('renders LOW risk styling correctly', () => {
    render(<RiskAssessment {...defaultProps} riskScore={2} riskLevel="LOW" />);

    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders HIGH risk styling correctly', () => {
    render(<RiskAssessment {...defaultProps} riskScore={9} riskLevel="HIGH" />);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders assessment text', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText(defaultProps.assessment)).toBeInTheDocument();
  });

  it('renders supervisor notification section', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('SUPERVISOR NOTIFICATION')).toBeInTheDocument();
    expect(screen.getByText(/SECURITY ALERT - MEDIUM/)).toBeInTheDocument();
  });

  it('renders ticket documentation section', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('TICKET DOCUMENTATION')).toBeInTheDocument();
    expect(screen.getByText(/SECURITY CONCERN DOCUMENTED/)).toBeInTheDocument();
  });

  it('renders copy buttons for documentation sections', () => {
    render(<RiskAssessment {...defaultProps} />);

    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    expect(copyButtons.length).toBe(2);
  });

  it('renders score markers', () => {
    render(<RiskAssessment {...defaultProps} />);

    // Check for score markers by looking at the specific container or by counting
    // Some numbers may appear multiple times (e.g., "5" in "5/10" and as a marker)
    for (let i = 1; i <= 10; i++) {
      const elements = screen.getAllByText(i.toString());
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });
});
