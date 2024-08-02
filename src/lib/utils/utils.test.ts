import { getFeedbackObjects, getFeedbackObjectByPath, toProperCase, formatDate, formatCurrency, type Feedback } from './utils';
import { expect, test, describe } from 'vitest';

describe('utils.ts tests', () => {
  
  describe('getFeedbackObjects', () => {
    test('should return an array of feedback objects', () => {
      const feedbacks = [
        { type: 'success', path: '/', title: 'Success', message: 'Operation successful' },
        { type: 'error', path: '/error', title: 'Error', message: 'Operation failed' },
      ] as Feedback[];
      const result = getFeedbackObjects(feedbacks);
      expect(result).toEqual(feedbacks);
    });
  });

  describe('getFeedbackObjectByPath', () => {
    test('should return the feedback object with the matching path', () => {
      const feedbacks = [
        { type: 'success', path: '/', title: 'Success', message: 'Operation successful' },
        { type: 'error', path: '/error', title: 'Error', message: 'Operation failed' },
      ] as Feedback[];
      const result = getFeedbackObjectByPath(feedbacks, '/error');
      expect(result).toEqual(feedbacks[1]);
    });

    test('should return undefined if no feedback object matches the path', () => {
      const feedbacks = [
        { type: 'success', path: '/', title: 'Success', message: 'Operation successful' },
        { type: 'error', path: '/error', title: 'Error', message: 'Operation failed' },
      ] as Feedback[];
      const result = getFeedbackObjectByPath(feedbacks, '/not-found');
      expect(result).toBeUndefined();
    });
  });

  describe('toProperCase', () => {
    test('should convert a string to proper case', () => {
      const result = toProperCase('hello world');
      expect(result).toEqual('Hello World');
    });

    test('should return an empty string if the input is an empty string', () => {
      const result = toProperCase('');
      expect(result).toEqual('');
    });

    test('should return undefined if the input is undefined', () => {
      const result = toProperCase(undefined as any);
      expect(result).toBeUndefined();
    });
  });

  describe('formatDate', () => {
    test('should format a date in seconds', () => {
      const date = 1617283200; // April 1, 2021
      const result = formatDate(date);
      expect(result).toEqual('April 1, 2021');
    });

    test('should format a date in milliseconds', () => {
      const date = 1617283200000; // April 1, 2021
      const result = formatDate(date);
      expect(result).toEqual('April 1, 2021');
    });

    test('should return "Invalid date" if the input is not a valid date', () => {
      const date = 'not a date';
      const result = formatDate(date);
      expect(result).toEqual('Invalid date');
    });
  });

  describe('formatCurrency', () => {
    test('should format a number as currency', () => {
      const amount = 1234.56;
      const result = formatCurrency(amount);
      expect(result).toEqual('$1,234.56');
    });

    test('should format 0 as currency', () => {
      const amount = 0;
      const result = formatCurrency(amount);
      expect(result).toEqual('$0.00');
    });

    test('should format a negative number as currency', () => {
      const amount = -1234.56;
      const result = formatCurrency(amount);
      expect(result).toEqual('-$1,234.56');
    });
  });
});
