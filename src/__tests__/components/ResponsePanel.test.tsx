import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponsePanel } from '@/components/ResponsePanel';

describe('ResponsePanel', () => {
  it('renders empty state when no response and not loading', () => {
    render(<ResponsePanel response="" loading={false} />);

    expect(screen.getByText('Ready to Assist')).toBeInTheDocument();
    expect(screen.getByText(/Select a category/)).toBeInTheDocument();
  });

  it('renders loading state when loading with no response', () => {
    render(<ResponsePanel response="" loading={true} />);

    expect(screen.getByText('Analyzing issue...')).toBeInTheDocument();
  });

  it('renders structured sections when response contains them', () => {
    const response = `## 🔍 REASON FOR THE CALL
User is unable to login to their account.

## 🛠️ TROUBLESHOOTING STEPS
1. Verify user credentials
2. Check account status in AD

## 📋 TICKET NOTES
\`\`\`
Issue: Login failure
Category: Password Reset
\`\`\`

## ⚠️ ESCALATION CRITERIA
- Escalate if account is locked for security reasons`;

    render(<ResponsePanel response={response} loading={false} />);

    expect(screen.getByText('REASON FOR THE CALL')).toBeInTheDocument();
    expect(screen.getByText('TROUBLESHOOTING STEPS')).toBeInTheDocument();
    expect(screen.getByText('TICKET NOTES')).toBeInTheDocument();
    expect(screen.getByText('ESCALATION CRITERIA')).toBeInTheDocument();
  });

  it('renders raw response when sections cannot be parsed', () => {
    const response = 'This is a simple response without sections.';

    render(<ResponsePanel response={response} loading={false} />);

    expect(screen.getByText(response)).toBeInTheDocument();
  });

  it('shows copy buttons for each section', () => {
    const response = `## 🔍 REASON FOR THE CALL
Test reason

## 🛠️ TROUBLESHOOTING STEPS
Test steps

## 📋 TICKET NOTES
Test notes

## ⚠️ ESCALATION CRITERIA
Test criteria`;

    render(<ResponsePanel response={response} loading={false} />);

    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    expect(copyButtons.length).toBe(4);
  });
});
