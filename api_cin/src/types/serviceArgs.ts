export interface ProductivityFilter {
  ano: number;
  limit?: number;
}

export interface LimitFilter {
  limit?: number;
}

export interface MunicipioFilter {
  nome_municipio: string;
}

export interface AutocompleteFilter {
  query: string;
  limit?: number;
}