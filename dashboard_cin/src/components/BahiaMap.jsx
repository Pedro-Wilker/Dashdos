import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Box, Tooltip, Text, useColorModeValue } from '@chakra-ui/react';
import { useAppContext } from '../main.jsx';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';

const geoUrl = "/bahia_municipios.json";

const BahiaMap = ({ isInteractive = true, highlightedCities = [] }) => {
  const { setSelectedCity } = useAppContext();
  const [selectedCity, setLocalSelectedCity] = useState(null);
  const [prevSelectedCity, setPrevSelectedCity] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const textFill = useColorModeValue('#1a202c', '#e2e8f0');

  const defaultColor = '#D7DBD9';
  const selectedColor = '#29C3FF';
  const prevSelectedColor = '#B1FF00';

  const { data: geoData, isLoading: geoLoading, error: geoError } = useQuery({
    queryKey: ['bahiaGeoJson'],
    queryFn: async () => {
      try {
        const res = await fetch(geoUrl);
        if (!res.ok) {
          const errorText = await res.text(); // Read as text to inspect HTML/errors
          console.error(`Failed to fetch GeoJSON: Status ${res.status}, Body: ${errorText.substring(0, 100)}...`);
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const json = await res.json();
        return json;
      } catch (err) {
        console.error('GeoJSON fetch error:', err.message);
        throw err;
      }
    },
    retry: 2, // Add retry for transient network issues
  });

  if (geoLoading) return <LoadingSpinner />;
  if (geoError) {
    console.error('Map error details:', geoError);
    return (
      <Text color="red.500">
        Error loading map: {geoError.message}. Check if /bahia_municipios.json exists in public/ or try a different host.
      </Text>
    );
  }

  const handleCityClick = (geo, event) => {
    if (!isInteractive) return;

    const cityName = geo.properties.NOME;
    if (selectedCity !== cityName) {
      setPrevSelectedCity(selectedCity);
      setLocalSelectedCity(cityName);
      setSelectedCity(cityName);
      setTooltipContent(cityName);
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseEnter = (geo, event) => {
    if (!isInteractive) return;
    const cityName = geo.properties.NOME;
    setTooltipContent(cityName);
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
  };

  return (
    <Box position="relative" width="100%" height="500px">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4000,
          center: [-38.5, -12.5],
        }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const cityName = geo.properties.NOME;
                const isHighlighted = highlightedCities.includes(cityName);
                const isSelected = cityName === selectedCity;
                const isPrevSelected = cityName === prevSelectedCity;

                return (
                  <Tooltip
                    key={geo.rsmKey}
                    label={tooltipContent}
                    isOpen={tooltipContent === cityName}
                    placement="top"
                    bg="bg.surface"
                    color={textFill}
                    hasArrow
                    offset={[0, 10]}
                    position="absolute"
                    top={`${tooltipPos.y}px`}
                    left={`${tooltipPos.x}px`}
                  >
                    <Geography
                      geography={geo}
                      fill={
                        isSelected
                          ? selectedColor
                          : isPrevSelected
                          ? prevSelectedColor
                          : isHighlighted
                          ? '#FFD700'
                          : defaultColor
                      }
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: isInteractive
                          ? { fill: '#63b3ed', outline: 'none', cursor: 'pointer' }
                          : { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                      onClick={(event) => handleCityClick(geo, event)}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    />
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {selectedCity && (
        <Box
          position="absolute"
          top="10px"
          left="10px"
          bg="bg.surface"
          p={2}
          borderRadius="md"
          boxShadow="sm"
          color={textFill}
        >
          <Text fontWeight="bold">Cidade Selecionada: {selectedCity}</Text>
        </Box>
      )}
    </Box>
  );
};

export default BahiaMap;