/**
 * @jest-environment jsdom
 */

import { act, render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';
import { submitAddress } from '@/actions/address';
import userEvent from "@testing-library/user-event";

jest.mock('@/actions/address', () => ({
  submitAddress: jest.fn()
}));

it('renders Home page', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Address Information/i);
  expect(linkElement).toBeInTheDocument();
});

it('should trigger validation errors when submit is clicked', () => {
  render(<Home />);
  const submitButton = screen.getByText(/Submit/i);
  act(() => {
    submitButton.click();
  });
  const suburbError = screen.getByText(/Suburb must be at least 3 characters/i);
  const postcodeError = screen.getByText(/Postcode must be at least 4 numbers/i);
  const stateError = screen.getByText(/Select a state/i);
  expect(suburbError).toBeInTheDocument();
  expect(postcodeError).toBeInTheDocument();
  expect(stateError).toBeInTheDocument();
});

it('should call submitAddress when form is submitted', async () => {
  render(<Home />);
  const submitButton = screen.getByText(/Submit/i);
  //fill in form
  const suburbInput = screen.getByPlaceholderText(/Enter your suburb/i);
  const postcodeInput = screen.getByPlaceholderText(/e.g. 3000/i);
  const stateInput = screen.getByDisplayValue(/Select state/i);
  
  await act(async () => {
    await userEvent.type(suburbInput, "Sydney");
    await userEvent.type(postcodeInput, "2000");
    await userEvent.selectOptions(stateInput, "NSW");
    submitButton.click();
  });
  expect(submitAddress).toHaveBeenCalled();
});