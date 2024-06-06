import SubmitButton from './SubmitButton.svelte';
import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';

test('submit button exists', () => {
  const { getByText } = render(SubmitButton, { props: { text: 'YOLO', running: true }});
  
  expect(getByText('YOLO')).toBeDefined();
});