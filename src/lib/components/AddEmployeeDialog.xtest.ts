// Import necessary testing utilities and the component to test
import { render, fireEvent } from '@testing-library/svelte';
import { afterAll, describe, expect, test, vi } from 'vitest';
import AddEmployeeDialog from './AddEmployeeDialog.svelte';
import { mockStores } from '../../../mocks/stores';

// Describe the component
xdescribe('AddEmployeeDialog', () => {
  const consoleMock = vi.spyOn(console, 'log')
      .mockImplementation(() => undefined);
      
  beforeAll(() => {
    mockStores({
      url: new URL('http://localhost:5173/app/employee'),
      params: {
        add: undefined,
      },
    });
  })
      
  afterAll(() => {
    consoleMock.mockReset();
    vi.restoreAllMocks();
  });

  // Test if the component renders without errors
  xtest('renders without errors', () => {
    const { getByText } = render(AddEmployeeDialog);
    expect(getByText('Add Employee')).toBeDefined();
  });

  // Test if the form submission works correctly
  xtest('submits the form correctly', async () => {
    const { getByText, getByLabelText } = render(AddEmployeeDialog);

    // Fill out the form
    await fireEvent.input(getByLabelText('First Name'), { target: { value: 'John' } });
    await fireEvent.input(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    await fireEvent.input(getByLabelText('Phone'), { target: { value: '1234567890', }});
    await fireEvent.input(getByLabelText('Email'), { target: { value: 'test@email.com', }});
    await fireEvent.input(getByLabelText('Address'), { target: { value: '123 Main St', }});
    await fireEvent.input(getByLabelText('Apt / Unit'), { target: { value: 'Suite 100', }});
    await fireEvent.input(getByLabelText('City'), { target: { value: 'Anytown', }});
    await fireEvent.input(getByLabelText('State'), { target: { value: 'CA', }});
    await fireEvent.input(getByLabelText('Zip'), { target: { value: '12345', }});

    // Submit the form
    await fireEvent.click(getByText('Save'));

    // Assert that the form submission was successful
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith('object');
  });

  // Test if the form validation works correctly
  xtest('validates the form correctly', async () => {
    const { getByText } = render(AddEmployeeDialog);

    // Try to submit the form without filling out required fields
    await fireEvent.click(getByText('Save'));

    // Assert that the form submission was not successful
    // This will depend on your actual implementation
  });
  
});
