import globalutil from 'src/util/globalutil';

export const businessType = [
  'Select Buisness Type...',
  'Sole Proprieter',
  'Partnership',
  'LLC',
  'Corporation(s,c)',
];

export function getBusinessTypeById(id) {
  // Ensure the index is within bounds
  const types = globalutil.businesstypes();
  const businessType = types.find((type) => type.id === id);
  return businessType ? businessType.name : '';
}
