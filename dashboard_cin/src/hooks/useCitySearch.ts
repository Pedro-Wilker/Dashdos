import { useState, useEffect, ChangeEvent } from 'react';
import { City } from '../types';

interface UseCitySearchReturn {
  filteredCities: City[];
  isSearchLoading: boolean;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function useCitySearch(cities: City[], searchQuery: string): UseCitySearchReturn {
  const [filteredCities, setFilteredCities] = useState<City[]>(cities);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    setIsSearchLoading(true);
    const filtered = cities.filter((city) =>
      city.nome_municipio.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCities(filtered);
    setTimeout(() => setIsSearchLoading(false), 300); // Simulate async search
  }, [cities, searchQuery]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredCities(
      cities.filter((city) =>
        city.nome_municipio.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return { filteredCities, isSearchLoading, handleSearch };
}