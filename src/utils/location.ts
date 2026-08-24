export interface LocationAddress {
  houseNo: string;
  buildingName?: string;
  streetName: string;
  area: string;
  pin: string;
  state?: string;
}

export const fetchAddressFromLocation = async (): Promise<LocationAddress> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const token = import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN;
          
          if (!token || token === '<YOUR_LOCATIONIQ_TOKEN>') {
            throw new Error('LocationIQ access token is missing in .env');
          }

          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${latitude}&lon=${longitude}&format=json`
          );
          
          if (!res.ok) {
            throw new Error('Failed to fetch address from LocationIQ');
          }

          const data = await res.json();
          const addressData = data.address || data;

          // Map LocationIQ fields to our schema fields
          const houseNo = addressData.house_number || '';
          const buildingName = addressData.building || addressData.residential || '';
          const streetName = addressData.road || addressData.pedestrian || addressData.street || '';
          const area = addressData.suburb || addressData.neighbourhood || addressData.city || addressData.county || '';
          const pin = addressData.postcode || '';
          const state = addressData.state || '';

          resolve({
            houseNo,
            buildingName,
            streetName,
            area,
            pin,
            state
          });
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        reject(new Error(error.message || 'Failed to get current position'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
