export const getVehicles = async (user, getVehicle) => {
  const getVehicleBody = {
    dspid: user.dspId.toString(),
  };
  // Wrap the fetchUsers call in a Promise
  return new Promise((resolve) => {
    getVehicle(
      '/Vehicles/vehicles',
      {
        method: 'POST',
        body: JSON.stringify(getVehicleBody),
      },
      (res) => {
        resolve(res); // Resolve the Promise with the data
      },
    );
  });
};
