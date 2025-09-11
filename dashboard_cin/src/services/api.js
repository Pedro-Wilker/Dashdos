import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

export const getVisitedCities = () => api.get('amplo-geral/visited-cities');
export const getStatusVisitaBreakdown = () => api.get('amplo-geral/status-visita-breakdown');
export const getStatusPublicacaoBreakdown = () => api.get('amplo-geral/status-publicacao-breakdown');
export const getStatusInstalacaoBreakdown = () => api.get('amplo-geral/status-instalacao-breakdown');
export const getAmploGeral = () => api.get('amplo-geral');
export const getTopCities = ({ ano = 2025, limit = 10 }) => api.get(`produtividade/top-cities?ano=${ano}&limit=${limit}`);
export const getGeralMensal = () => api.get('produtividade/geral-mensal');
export const getByCidade = (cidade) => api.get(`produtividade/by-cidade/${cidade}`);

// Adicione estas duas de volta:
export const getTopAndLeastCities = ({ ano = 2025, limit = 5 }) => api.get(`produtividade/top-and-least-cities?ano=${ano}&limit=${limit}`);
export const getCityDetails = (nome_municipio) => api.get(`amplo-geral/nome-municipio?nome_municipio=${nome_municipio}`);