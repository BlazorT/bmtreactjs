/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: FilterSection.jsx
// ============================================================================
import React, { useMemo } from 'react';
import { cilFlagAlt } from '@coreui/icons';
import CustomSearch from 'src/components/InputsComponent/CustomSearch';
import Button from 'src/components/UI/Button';
import globalutil from 'src/util/globalutil';

const FilterSection = ({
  selectedCity,
  setSelectedCity,
  selectedOrg,
  setSelectedOrg,
  destinationOrg,
  setDestinationOrg,
  activeMode,
  cities,
  orgs,
  user,
  resetSelection,
}) => {
  const filteredOrgs = useMemo(() => {
    if (!orgs) return [];
    let filtered = orgs.filter((org) => org.id !== user.orgId);
    if (selectedCity) {
      filtered = filtered.filter((org) => org.cityId === parseInt(selectedCity));
    }
    return filtered;
  }, [orgs, selectedCity, user.orgId]);

  const destinationOrgs = useMemo(() => {
    if (!orgs) return [];
    let filtered = orgs.filter((org) => org.id !== user.orgId && org.id !== selectedOrg?.id);
    if (selectedCity) {
      filtered = filtered.filter((org) => org.cityId === parseInt(selectedCity));
    }
    return filtered;
  }, [orgs, user.orgId, selectedOrg, selectedCity]);

  return (
    <div className="row g-3 mb-2">
      <div className="col-md-4">
        <CustomSearch
          label="City"
          value={!selectedCity ? '' : cities?.find((c) => c?.id == selectedCity)}
          onChange={(e) => {
            setSelectedCity(e?.id?.toString());
            if (activeMode === 'import') setSelectedOrg(null);
            else setDestinationOrg(null);
          }}
          icon={cilFlagAlt}
          id="city"
          data={cities}
          name="name"
          placeholder="Select City"
          isRequired={false}
          title="City"
          getOptionLabel={(option) => {
            const state = globalutil.states().find((s) => s?.id === option?.stateId);
            return `${option?.name}${state ? ' (' + state?.name + ')' : ''}`;
          }}
        />
      </div>

      {activeMode === 'import' && (
        <div className="col-md-4">
          <CustomSearch
            label={`Source Organization`}
            value={selectedOrg}
            onChange={(org) => {
              setSelectedOrg(org || null);
            }}
            icon={cilFlagAlt}
            id="source-org"
            data={filteredOrgs}
            name="name"
            placeholder="Select Source Org"
            isRequired={false}
            title="Source Organization"
            disabled={filteredOrgs.length === 0}
          />
        </div>
      )}

      {activeMode === 'transfer' && (
        <div className="col-md-4">
          <CustomSearch
            label="Destination Organization"
            value={destinationOrg}
            onChange={(org) => {
              setDestinationOrg(org || null);
            }}
            icon={cilFlagAlt}
            id="dest-org"
            data={destinationOrgs}
            name="name"
            placeholder="Select Destination Org"
            isRequired={false}
            title="Destination Organization"
            disabled={!selectedOrg || destinationOrgs.length === 0}
          />
        </div>
      )}

      {activeMode === 'import' && (
        <div className="col-md-4 d-flex align-items-end">
          <Button title="Reset Filters" onClick={resetSelection} className="w-100 mb-1" />
        </div>
      )}

      {activeMode === 'transfer' && (
        <div className="col-md-4 d-flex align-items-end">
          <Button title="Reset Filters" onClick={resetSelection} className="w-auto mb-1 px-3" />
        </div>
      )}
    </div>
  );
};

export default FilterSection;
