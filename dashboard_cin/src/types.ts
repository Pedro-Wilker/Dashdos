export interface ApiResponse<T> {
  data: T;
  meta?: { count: number }; // Make meta optional
}

export interface City {
  id?: number;
  nome_municipio: string;
  status_infra?: string;
  cidade_visita?: boolean;
  periodo_visita?: string;
  periodo_instalacao?: string;
  data_visita?: string | null;
  data_instalacao?: string | null;
  status_visita?: string;
  status_publicacao?: string;
  status_instalacao?: string;
  publicacao?: string;
  createAt?: string;
  updateAt?: string;
  produtividades_diarias?: {
    id: number;
    cin_amplo_geral_id: number;
    data: string;
    quantidade: number;
    createAt: string;
    updateAt: string;
  }[];
}

export interface TopCity {
  nome_municipio: string;
  total_quantidade: number;
  [key: string]: string | number | Date | null | undefined;
}

export interface MonthlyData {
  monthYear: string;
  quantidade: number;
}

export interface VisitedCitiesResponse {
  visitedCount: number;
  totalCities: number;
  percentage: number;
  visitedCities: City[];
}

export interface StatusVisitaBreakdownResponse {
  approvedCount: number;
  rejectedCount: number;
  totalCitiesWithStatus: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  approvedCities: City[];
  rejectedCities: City[];
}

export interface StatusPublicacaoBreakdownResponse {
  publishedCount: number;
  awaitingCount: number;
  totalCitiesWithStatus: number;
  publishedPercentage: number;
  awaitingPercentage: number;
  publishedCities: City[];
  awaitingPublicationCities: City[];
}

export interface StatusInstalacaoBreakdownResponse {
  installedCount: number;
  awaitingCount: number;
  totalCitiesWithStatus: number;
  installedPercentage: number;
  awaitingPercentage: number;
  installedCities: City[];
  awaitingInstallationCities: City[];
}

export interface ByCidadeResponse {
  nome_municipio: string;
  totalProdutividade: number;
  monthlyProdutividade: MonthlyData[];
}

export interface TopAndLeastCitiesResponse {
  topCities: TopCity[];
  leastCities: TopCity[];
}