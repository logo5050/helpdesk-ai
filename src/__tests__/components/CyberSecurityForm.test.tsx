import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CyberSecurityForm } from '@/components/CyberSecurityForm';

describe('CyberSecurityForm', () => {
  const defaultProps = {
    loading: false,
    onAssess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all security flag checkboxes', () => {
    render(<CyberSecurityForm {...defaultProps} />);

    expect(screen.getByText('Caller could not verify their full name')).toBeInTheDocument();
    expect(screen.getByText('Caller failed security questions')).toBeInTheDocument();
    expect(screen.getByText('Caller refused to provide employee ID')).toBeInTheDocument();
    expect(screen.getByText("Caller is requesting access to another user's account")).toBeInTheDocument();
    expect(screen.getByText('Caller is requesting password reset for a VIP/admin account')).toBeInTheDocument();
    expect(screen.getByText('Caller is pressuring for immediate action / urgency')).toBeInTheDocument();
  });

  it('renders additional context textarea', () => {
    render(<CyberSecurityForm {...defaultProps} />);

    expect(screen.getByText('Additional Context')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/provide any additional context/i)).toBeInTheDocument();
  });

  it('disables assess button when no flags are selected', () => {
    render(<CyberSecurityForm {...defaultProps} />);

    const button = screen.getByRole('button', { name: /assess security risk/i });
    expect(button).toBeDisabled();
  });

  it('enables assess button when a flag is selected', () => {
    render(<CyberSecurityForm {...defaultProps} />);

    // Click on the label text which should toggle the checkbox
    const labelText = screen.getByText('Caller failed security questions');
    const label = labelText.closest('label');
    fireEvent.click(label!);

    const button = screen.getByRole('button', { name: /assess security risk/i });
    expect(button).not.toBeDisabled();
  });

  it('shows loading state on button', () => {
    render(<CyberSecurityForm {...defaultProps} loading={true} />);

    expect(screen.getByText('Assessing Risk...')).toBeInTheDocument();
  });

  it('calls onAssess with selected flags when button is clicked', () => {
    const onAssess = jest.fn();
    render(<CyberSecurityForm {...defaultProps} onAssess={onAssess} />);

    // Click on the label to toggle the checkbox
    const labelText = screen.getByText('Caller failed security questions');
    const label = labelText.closest('label');
    fireEvent.click(label!);

    const button = screen.getByRole('button', { name: /assess security risk/i });
    fireEvent.click(button);

    expect(onAssess).toHaveBeenCalledTimes(1);
    expect(onAssess).toHaveBeenCalledWith(
      ['Caller failed security questions'],
      ''
    );
  });

  it('includes "Other" flag when custom text is provided', () => {
    const onAssess = jest.fn();
    render(<CyberSecurityForm {...defaultProps} onAssess={onAssess} />);

    const otherInput = screen.getByPlaceholderText(/describe any other concerning behavior/i);
    fireEvent.change(otherInput, { target: { value: 'Custom concern' } });

    const button = screen.getByRole('button', { name: /assess security risk/i });
    fireEvent.click(button);

    expect(onAssess).toHaveBeenCalledWith(
      ['Other: Custom concern'],
      ''
    );
  });
});
