// Api/services.ts
const TREFLE_TOKEN = 'usr-XvL2Ir4cgiUT8kLfw2g3zlyXu5lxwXW0VM54jqPPTWY';
const AGRO_API_KEY = 'ec91f6ad8a3bb764f20955b31a1abd8b';

export const buscarDadosTrefle = async (nomePlanta: string) => {
  try {
    const url = `https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${nomePlanta}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.data && json.data.length > 0 ? json.data[0] : null;
  } catch (error) {
    return null;
  }
};

export const atualizarClimaAgro = async (lat: number, lon: number) => {
  try {
    const url = `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lon}&appid=${AGRO_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data; 
  } catch (error) {
    return null;
  }
};