// Api/services.ts
const TREFLE_TOKEN = 'usr-XvL2Ir4cgiUT8kLfw2g3zlyXu5lxwXW0VM54jqPPTWY';
const AGRO_API_KEY = 'ec91f6ad8a3bb764f20955b31a1abd8b';
const SINRIC_API_KEY = '89cda427-c430-4127-9a60-afd89f2364d7';

const IDs = {
  SOLO: "68df50c05918d860c09f0b6c",
  DHT: "68df51a05918d860c09f0c9d",
  BOMBA: "68df4f4a5918d860c09f0b00"
};

export const buscarDadosTrefle = async (nomePlanta: string) => {
  try {
    const url = `https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${nomePlanta}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.data?.[0] || null;
  } catch (error) { return null; }
};

export const atualizarClimaAgro = async (lat: number, lon: number) => {
  try {
    const url = `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lon}&appid=${AGRO_API_KEY}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) { return null; }
};

export const buscarDadosSinric = async () => {
  try {
    const headers = { 'x-sinricpro-apikey': SINRIC_API_KEY };
    const [resSolo, resDHT] = await Promise.all([
      fetch(`https://api.sinric.pro/v1/devices/${IDs.SOLO}`, { headers }),
      fetch(`https://api.sinric.pro/v1/devices/${IDs.DHT}`, { headers })
    ]);
    const soloJson = await resSolo.json();
    const dhtJson = await resDHT.json();

    return {
      powerLevel: soloJson.success ? soloJson.device.state.powerLevel : null,
      temperature: dhtJson.success ? dhtJson.device.state.temperature : null,
      humidity: dhtJson.success ? dhtJson.device.state.humidity : null
    };
  } catch (error) { return null; }
};