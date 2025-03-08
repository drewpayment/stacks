

export interface OnboardingRequirements {
  hasHireDate: boolean;
  hasFullName: boolean;
  hasAddress: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasDirectPayroll: boolean;
  hasW9Requirement: boolean;
  // only required if hasW9Requirement is true
  hasW9Completed?: boolean; 
  optionalTasks?: string[];
}