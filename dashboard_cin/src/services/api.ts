import axios from 'axios';
import {
  City,
  TopCity,
  MonthlyData,
  ApiResponse,
  VisitedCitiesResponse,
  StatusVisitaBreakdownResponse,
  StatusPublicacaoBreakdownResponse,
  StatusInstalacaoBreakdownResponse,
  ByCidadeResponse,
  TopAndLeastCitiesResponse,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/v1/',
});

export const getVisitedCities = () =>
  api.get<ApiResponse<VisitedCitiesResponse>>('amplo-geral/visited-cities');

export const getStatusVisitaBreakdown = () =>
  api.get<ApiResponse<StatusVisitaBreakdownResponse>>('amplo-geral/status-visita-breakdown');

export const getStatusPublicacaoBreakdown = () =>
  api.get<ApiResponse<StatusPublicacaoBreakdownResponse>>('amplo-geral/status-publicacao-breakdown');

export const getStatusInstalacaoBreakdown = () =>
  api.get<ApiResponse<StatusInstalacaoBreakdownResponse>>('amplo-geral/status-instalacao-breakdown');

export const getAmploGeral = () => api.get<ApiResponse<City[]>>('amplo-geral');

export const getTopCities = ({ ano = 2025, limit = 10 }: { ano?: number; limit?: number }) =>
  api.get<ApiResponse<TopCity[]>>(`produtividade/top-cities?ano=${ano}&limit=${limit}`);

export const getGeralMensal = () => api.get<ApiResponse<MonthlyData[]>>('produtividade/geral-mensal');

export const getByCidade = (cidade: string) =>
  api.get<ApiResponse<ByCidadeResponse>>(`produtividade/by-cidade/${cidade}`);

export const getTopAndLeastCities = ({ ano = 2025, limit = 5 }: { ano?: number; limit?: number }) =>
  api.get<ApiResponse<TopAndLeastCitiesResponse>>(`produtividade/top-and-least-cities?ano=${ano}&limit=${limit}`);

export const getCityDetails = (nome_municipio: string) =>
  api.get<ApiResponse<City[]>>(`amplo-geral/nome-municipio?nome_municipio=${nome_municipio}`);