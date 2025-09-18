import { createContext, useContext, useState, ReactNode } from 'react';

// Define interfaces for city and card data
interface City {
  id?: number;
  nome_municipio: string;
  status_visita?: string;
  status_publicacao?: string;
  status_instalacao?: string;
  periodo_visita?: string;
}

interface CardData {
  [key: string]: {
    percentage: number | null;
    cities: City[] | null;
  };
}

interface AppContextType {
  cardData: CardData | null;
  setCardData: (data: CardData | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ cardData, setCardData, selectedCity, setSelectedCity }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};