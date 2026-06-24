export const SCRUM_VALUES = ['Commitment', 'Courage', 'Focus', 'Openness', 'Respect'] as const
export type ScrumValue = (typeof SCRUM_VALUES)[number]

export const SCRUM_VALUE_MAP: Record<string, ScrumValue[]> = {
  'Trust': ['Openness'],
  'Innovation': ['Courage'],
  'Quality': ['Commitment'],
  'Speed': ['Focus'],
  'Transparency': ['Openness'],
  'Courage': ['Courage'],
  'Collaboration': ['Commitment', 'Respect'],
  'Ownership': ['Commitment'],
  'Learning': ['Openness', 'Courage'],
  'Customer focus': ['Focus'],
  'Simplicity': ['Focus'],
  'Diversity': ['Respect', 'Openness'],
  'Sustainability': ['Commitment'],
  'Fun': ['Respect'],
  'Integrity': ['Openness', 'Commitment'],
  'Excellence': ['Commitment', 'Focus'],
  'Empathy': ['Respect'],
  'Autonomy': ['Courage'],
  'Respect': ['Respect'],
  'Impact': ['Commitment', 'Focus'],
}
