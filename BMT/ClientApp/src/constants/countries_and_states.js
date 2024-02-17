import globalutil from 'src/util/globalutil';

export function getStateById(stateId) {
  const state = globalutil.states().find((state) => state.id === stateId);
  return state ? state.name : '';
}

export function getCountryById(countryId) {
  if (countryId === '') {
    return '';
  } else if (countryId < 54) {
    return 'United States';
  } else {
    return 'Canada';
  }
}
