import React from 'react';
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SaveToAccountButton from './SaveToAccountButton';

describe('SaveToAccountButton', () => {
  it('should render the save label', () => {
    render(<SaveToAccountButton toolName="t" getFiles={() => []} />);
    expect(screen.getByRole('button')).toHaveTextContent('Save to my Dawarich account');
  });

  it('should explain when there is nothing to upload', async () => {
    render(<SaveToAccountButton toolName="t" getFiles={() => []} />);
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('No files to save. Upload a file first.')).toBeInTheDocument();
  });
});
