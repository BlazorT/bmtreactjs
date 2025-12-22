import { useState, useCallback } from 'react';

/**
 * Custom hook for managing network, post type, and template selection
 */
export const useNetworkSelection = (
  initialNetworks = [],
  initialPostTypes = {},
  initialTemplates = {},
) => {
  const [selectedNetworks, setSelectedNetworks] = useState(initialNetworks);
  const [selectedPostTypes, setSelectedPostTypes] = useState(initialPostTypes);
  const [selectedTemplates, setSelectedTemplates] = useState(initialTemplates);

  const toggleNetwork = useCallback((networkName) => {
    setSelectedNetworks((prevSelected) => {
      const isSelected = prevSelected.includes(networkName);
      const updatedNetworks = isSelected
        ? prevSelected.filter((n) => n !== networkName)
        : [...prevSelected, networkName];

      // If network is unchecked, also remove its postTypes and templates
      if (isSelected) {
        setSelectedPostTypes((prevPostTypes) => {
          const updatedPostTypes = { ...prevPostTypes };
          delete updatedPostTypes[networkName];
          return updatedPostTypes;
        });

        setSelectedTemplates((prevTemplates) => {
          const updatedTemplates = { ...prevTemplates };
          delete updatedTemplates[networkName];
          return updatedTemplates;
        });
      }

      return updatedNetworks;
    });
  }, []);

  const togglePostType = useCallback((networkName, postTypeId) => {
    setSelectedPostTypes((prev) => {
      const prevPostTypes = prev[networkName] || [];
      const updated = prevPostTypes.includes(postTypeId)
        ? prevPostTypes.filter((id) => id !== postTypeId)
        : [...prevPostTypes, postTypeId];

      return {
        ...prev,
        [networkName]: updated,
      };
    });
  }, []);

  const toggleTemplate = useCallback((networkName, template) => {
    setSelectedTemplates((prev) => {
      const currentTemplate = prev[networkName];
      return {
        ...prev,
        [networkName]: currentTemplate?.id === template.id ? null : template,
      };
    });
  }, []);

  const setNetworkPostTypes = useCallback((networkName, postTypeIds) => {
    setSelectedPostTypes((prev) => ({
      ...prev,
      [networkName]: postTypeIds,
    }));
  }, []);

  const setNetworkTemplate = useCallback((networkName, template) => {
    setSelectedTemplates((prev) => ({
      ...prev,
      [networkName]: template,
    }));
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedNetworks([]);
    setSelectedPostTypes({});
    setSelectedTemplates({});
  }, []);

  return {
    selectedNetworks,
    selectedPostTypes,
    selectedTemplates,
    setSelectedNetworks,
    setSelectedPostTypes,
    setSelectedTemplates,
    toggleNetwork,
    togglePostType,
    toggleTemplate,
    setNetworkPostTypes,
    setNetworkTemplate,
    resetSelection,
  };
};
