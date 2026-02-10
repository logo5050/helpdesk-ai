import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RiskAssessment } from '@/components/RiskAssessment';

describe('RiskAssessment', () => {
  const defaultProps = {
    riskScore: 5,
    riskLevel: 'MEDIUM' as const,
    assessment: 'This is a test assessment with multiple concerning factors.',
    supervisorNotification: 'SECURITY ALERT - MEDIUM\nRisk Score: 5/10',
    ticketDocumentation: 'SECURITY CONCERN DOCUMENTED\nRisk Level: MEDIUM',
  };

  it('renders threat level heading', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('Threat Level')).toBeInTheDocument();
  });

  it('renders risk level badge with RISK suffix', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('MEDIUM RISK')).toBeInTheDocument();
  });

  it('renders LOW risk level correctly', () => {
    render(<RiskAssessment {...defaultProps} riskScore={2} riskLevel="LOW" />);

    expect(screen.getByText('LOW RISK')).toBeInTheDocument();
  });

  it('renders HIGH risk level correctly', () => {
    render(<RiskAssessment {...defaultProps} riskScore={9} riskLevel="HIGH" />);

    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
  });

  it('renders threat analysis section', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('Threat Analysis')).toBeInTheDocument();
  });

  it('renders assessment text', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText(defaultProps.assessment)).toBeInTheDocument();
  });

  it('renders supervisor alert section', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('Supervisor Alert')).toBeInTheDocument();
    expect(screen.getByText(/SECURITY ALERT - MEDIUM/)).toBeInTheDocument();
  });

  it('renders ticket notes section', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('Ticket Notes')).toBeInTheDocument();
    expect(screen.getByText(/SECURITY CONCERN DOCUMENTED/)).toBeInTheDocument();
  });

  it('renders copy buttons for documentation sections', () => {
    render(<RiskAssessment {...defaultProps} />);

    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    expect(copyButtons.length).toBe(2);
  });

  it('renders score display with /10 indicator', async () => {
    render(<RiskAssessment {...defaultProps} />);

    // The score animates, so we need to wait for final state
    await waitFor(() => {
      expect(screen.getByText('/10')).toBeInTheDocument();
    });
  });

  it('renders risk bar scale labels', () => {
    render(<RiskAssessment {...defaultProps} />);

    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('shows warning icon for HIGH risk level', () => {
    const { container } = render(<RiskAssessment {...defaultProps} riskScore={8} riskLevel="HIGH" />);

    // HIGH risk shows a warning triangle icon (SVG with the warning path)
    const warningPath = container.querySelector('path[fill-rule="evenodd"]');
    expect(warningPath).toBeInTheDocument();
  });
});
