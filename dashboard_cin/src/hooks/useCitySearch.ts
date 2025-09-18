import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCityDetails } from '../services/api';
import { AxiosResponse } from 'axios';
import { ApiResponse, City } from '../types';

export const useCitySearch = (cities: Array<{ nome_municipio: string }>, title: string) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);

  const { data: searchResult, isLoading: isSearchLoading } = useQuery<City[] | undefined, Error>({
    queryKey: ['searchCity', searchTerm, title],
    queryFn: async () => {
      if (!searchTerm) return undefined;
      const res: AxiosResponse<ApiResponse<City[]>> = await getCityDetails(searchTerm);
      return res.data.data; // Extract the inner 'data' array from ApiResponse
    },
    enabled: !!searchTerm,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value) {
      setFilteredCities(cities);
    } else {
      setFilteredCities(searchResult || []);
    }
  };

  return { searchTerm, filteredCities, isSearchLoading, handleSearch };
};