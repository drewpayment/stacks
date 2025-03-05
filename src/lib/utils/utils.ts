import dayjs from 'dayjs';

type FeedbackType = 'success' | 'error' | 'warning' | 'info';
type Feedback = {
	type: FeedbackType;
	path?: string;
	title: string;
	message: string;
};

const getFeedbackObjects = (feedbacks: Feedback[]): Feedback[] => {
	return feedbacks.map((feedback) => {
		return {
			type: feedback.type,
			path: feedback.path,
			title: feedback.title,
			message: feedback.message
		};
	});
};

const getFeedbackObjectByPath = (
	feedbacks: Feedback[] | undefined,
	path: string
): Feedback | undefined => {
	return feedbacks?.find((feedback) => {
		return feedback.path === path;
	});
};

const toProperCase = (str: string): string => {
	return str && str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function determineEpochFormat(timestamp: number): 'seconds' | 'milliseconds' {
  const numDigits = timestamp.toString().length;

  if (numDigits >= 13) {
    // Likely milliseconds
    if (dayjs.unix(timestamp / 1000).isValid()) { 
      return 'milliseconds'; 
    }
  } else if (numDigits === 10) {
    // Likely seconds
    if (dayjs.unix(timestamp).isValid()) { 
      return 'seconds'; 
    }
  }

  // Unable to determine definitively
  throw new Error('Invalid timestamp format'); 
}

const formatDate = (date: any, format = 'MMMM D, YYYY') => {
	const dateNum = Number(date);
	
	if (isNaN(dateNum)) {
		const dayjsDate = dayjs(date);
		if (dayjsDate.isValid()) {
			return dayjsDate.format(format);
		}
		
		return 'Invalid date';
	}
	
	const epochFormat = determineEpochFormat(dateNum);
	return epochFormat === 'seconds' ? dayjs.unix(dateNum).format(format) : dayjs(dateNum).format(format);
}

export const toDateString = (date: Date): string => dayjs(date).format('YYYY-MM-DD');

export const toHumanDate = (date: Date): string => dayjs(date).format('MMMM D, YYYY');

const formatCurrency = (amount: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export { getFeedbackObjectByPath, getFeedbackObjects, type Feedback, toProperCase, formatDate, formatCurrency };
