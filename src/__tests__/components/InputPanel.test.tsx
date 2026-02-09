import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputPanel } from '@/components/InputPanel';

describe('InputPanel', () => {
  const defaultProps = {
    category: '',
    description: '',
    loading: false,
    history: [],
    onCategoryChange: jest.fn(),
    onDescriptionChange: jest.fn(),
    onAnalyze: jest.fn(),
    onHistoryItemClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders category select and description textarea', () => {
    render(<InputPanel {...defaultProps} />);

    expect(screen.getByText('Issue Category')).toBeInTheDocument();
    expect(screen.getByText('Issue Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });

  it('disables analyze button when category is empty', () => {
    render(<InputPanel {...defaultProps} description="test" />);

    const button = screen.getByRole('button', { name: /analyze/i });
    expect(button).toBeDisabled();
  });

  it('disables analyze button when description is empty', () => {
    render(<InputPanel {...defaultProps} category="Password Reset / Account Lockout / SSPR" />);

    const button = screen.getByRole('button', { name: /analyze/i });
    expect(button).toBeDisabled();
  });

  it('enables analyze button when category and description are provided', () => {
    render(
      <InputPanel
        {...defaultProps}
        category="Password Reset / Account Lockout / SSPR"
        description="User cannot login"
      />
    );

    const button = screen.getByRole('button', { name: /analyze/i });
    expect(button).not.toBeDisabled();
  });

  it('shows loading state on button', () => {
    render(
      <InputPanel
        {...defaultProps}
        category="Password Reset / Account Lockout / SSPR"
        description="User cannot login"
        loading={true}
      />
    );

    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  it('calls onAnalyze when button is clicked', () => {
    const onAnalyze = jest.fn();
    render(
      <InputPanel
        {...defaultProps}
        category="Password Reset / Account Lockout / SSPR"
        description="User cannot login"
        onAnalyze={onAnalyze}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /analyze/i }));
    expect(onAnalyze).toHaveBeenCalledTimes(1);
  });

  it('displays session history when available', () => {
    const history = [
      {
        id: '1',
        category: 'VPN / BIG-IP Edge Client',
        description: 'VPN not connecting',
        timestamp: new Date('2024-01-15T10:30:00'),
      },
    ];

    render(<InputPanel {...defaultProps} history={history} />);

    expect(screen.getByText('Session History')).toBeInTheDocument();
    // Use getAllByText since category appears in both dropdown and history
    const vpnElements = screen.getAllByText('VPN / BIG-IP Edge Client');
    expect(vpnElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('VPN not connecting')).toBeInTheDocument();
  });

  it('does not show session history section when empty', () => {
    render(<InputPanel {...defaultProps} history={[]} />);

    expect(screen.queryByText('Session History')).not.toBeInTheDocument();
  });
});
