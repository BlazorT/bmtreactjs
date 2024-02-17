import globalutil from 'src/util/globalutil';

export const vechicleStatus = [
  { id: 1, name: 'Operational' },
  { id: 2, name: 'Grounded' },
  { id: 3, name: 'Under Maintanance' },
];

export const getVehicleGridValueById = (type, id) => {
  const dataMap = {
    make: globalutil.makes(),
    vehicleType: globalutil.vehicletypes(),
    ownership: globalutil.ownerships(),
    status: globalutil.commonstatuses(),
  };

  const dataArray = dataMap[type];
  const find = dataArray.find((car) => car.id === id);
  return find ? find.name : '';
};
