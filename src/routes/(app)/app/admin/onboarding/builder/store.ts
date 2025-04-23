// /Users/drew.payment/dev/stacks/src/routes/(app)/app/admin/onboarding/builder/store.ts
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store'; // Optional: for type safety

// --- Define Types (Recommended for better maintainability) ---
export type Field = { id: string; label: string; type: string };

export type Step = {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  tags: string[];
  position: number;
  required: boolean;
  assignedTo: string[];
  fields: Field[];
};

export type Category = { id: string; name: string; color: string };

export type Template = { id: string; name: string; stepCount: number };

export type AvailableStep = { id: string; name: string; category: string };

// Define the shape of the state
export interface OnboardingState {
  steps: Step[];
  categories: Category[];
  templates: Template[];
  availableSteps: AvailableStep[];
  selectedStep: string | null; // Use null if nothing might be selected initially
}

// --- Initial State ---
const initialState: OnboardingState = {
  steps: [
    {
      id: 'pre-start',
      title: 'Pre-Start',
      dueDate: 'Before Start',
      category: 'HR',
      tags: ['HR'],
      position: 0,
      required: true,
      assignedTo: ['HR'],
      fields: []
    },
    {
      id: 'personal-info',
      title: 'Personal Information',
      dueDate: 'Day 1',
      category: 'Personal',
      tags: ['Personal', 'Employee'],
      position: 1,
      required: true,
      assignedTo: ['Employee'],
      fields: [
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'address', label: 'Address', type: 'text' },
        { id: 'phone', label: 'Phone', type: 'tel' }
      ]
    },
    {
      id: 'tax-docs',
      title: 'Tax Documentation',
      dueDate: 'Day 1',
      category: 'Documents',
      tags: ['Documents', 'Employee'],
      position: 2,
      required: true,
      assignedTo: ['Employee'],
      fields: []
    },
    {
      id: 'equipment',
      title: 'Equipment Setup',
      dueDate: 'Day 3',
      category: 'IT Setup',
      tags: ['IT Setup', 'IT'],
      position: 3,
      required: true,
      assignedTo: ['IT'],
      fields: []
    },
    {
      id: 'policy-ack',
      title: 'Policy Acknowledgements',
      dueDate: 'Week 1',
      category: 'Compliance',
      tags: ['Compliance', 'Employee'],
      position: 4,
      required: true,
      assignedTo: ['Employee'],
      fields: []
    }
  ],
  categories: [
    { id: 'personal', name: 'Personal', color: 'bg-blue-500' },
    { id: 'documents', name: 'Documents', color: 'bg-amber-500' },
    { id: 'it-setup', name: 'IT Setup', color: 'bg-purple-500' },
    { id: 'training', name: 'Training', color: 'bg-green-500' },
    { id: 'compliance', name: 'Compliance', color: 'bg-red-500' }
  ],
  templates: [
    { id: 'standard', name: 'Standard Onboarding', stepCount: 7 },
    { id: 'remote', name: 'Remote Employee', stepCount: 8 },
    { id: 'management', name: 'Management Role', stepCount: 10 }
  ],
  availableSteps: [
    { id: 'contact-info', name: 'Contact Information', category: 'Personal' },
    { id: 'emergency-contacts', name: 'Emergency Contacts', category: 'Personal' }
  ],
  selectedStep: 'personal-info', // Or set to null if nothing is selected by default
};

// --- Create the Writable Store ---
const store: Writable<OnboardingState> = writable(initialState);

// --- Define Methods to Interact with the Store ---

// Helper function to update the store immutably
const updateStore = (updater: (state: OnboardingState) => OnboardingState) => {
  store.update(updater);
};

const addStep = (newStepData: Omit<Step, 'id' | 'position'> & Partial<Pick<Step, 'id' | 'position'>>) => {
  updateStore(currentStore => {
    const newStep: Step = {
      id: newStepData.id || crypto.randomUUID(), // Generate ID if not provided
      position: newStepData.position ?? currentStore.steps.length, // Append if position not provided
      ...newStepData,
      assignedTo: newStepData.assignedTo || [], // Sensible default
      tags: newStepData.tags || [], // Sensible default
    };
    newStep.fields = newStep.fields ?? [];
    // Ensure positions are unique and sequential if needed, or re-sort
    const updatedSteps = [...currentStore.steps, newStep].sort((a, b) => a.position - b.position);

    return {
      ...currentStore,
      steps: updatedSteps
    };
  });
};

const updateStep = (stepId: string, data: Partial<Omit<Step, 'id'>>) => {
  updateStore(currentStore => {
    const stepIndex = currentStore.steps.findIndex((step) => step.id === stepId);
    if (stepIndex !== -1) {
      // Create a new array for steps to ensure reactivity
      const newSteps = [...currentStore.steps];
      // Create a new step object by merging old and new data
      newSteps[stepIndex] = { ...newSteps[stepIndex], ...data };
      return { ...currentStore, steps: newSteps };
    }
    // If step not found, return the current state unchanged
    return currentStore;
  });
};

const addField = (stepId: string, field: Field) => {
  updateStore(currentStore => {
    const stepIndex = currentStore.steps.findIndex((step) => step.id === stepId);
    if (stepIndex !== -1) {
      const newSteps = [...currentStore.steps];
      const targetStep = newSteps[stepIndex];
      // Create a new step object with the updated fields array
      newSteps[stepIndex] = {
        ...targetStep,
        // Create a new fields array
        fields: [...targetStep.fields, field]
      };
      return { ...currentStore, steps: newSteps };
    }
    return currentStore;
  });
};

const setSelectedStep = (stepId: string | null) => {
    updateStore(currentStore => ({
        ...currentStore,
        selectedStep: stepId
    }));
}

// --- Export the Store and its Methods ---
export const onboardingStore = {
  // Expose the core store methods: subscribe, set, update
  subscribe: store.subscribe,
  set: store.set, // Allows replacing the entire state object
  update: store.update, // Allows custom updates using a callback

  // Expose custom action methods
  addStep,
  updateStep,
  addField,
  setSelectedStep,

  // You can also add selectors here if needed, e.g.,
  // getStepById: (id: string) => get(store).steps.find(step => step.id === id)
  // (requires importing `get` from `svelte/store`)
};

// Optional: Export the store directly if you only need subscribe/set/update
// export default store;
