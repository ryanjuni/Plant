// Api/sinricApi.ts
const APP_KEY = "89cda427-c430-4127-9a60-afd89f2364d7";
const DEVICE_ID = "68df50c05918d860c09f0b6c"; // ID do sensor de solo/temp

export const getSensorData = async () => {
  try {
    const response = await fetch(`https://api.sinric.pro/v1/devices/${DEVICE_ID}`, {
      method: 'GET',
      headers: {
        'x-sinricpro-apikey': APP_KEY,
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    return json.success ? json.device.state : null;
  } catch (error) {
    console.error("Erro na Sinric:", error);
    return null;
  }
};