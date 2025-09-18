import React, { useState, useRef, useEffect, memo } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

interface BahiaMapProps {
  isInteractive?: boolean;
  highlightedCities?: string[];
  selectedCity?: string | null;
  setSelectedCity?: (city: string) => void;
}

interface GeographyType {
  rsmKey: string;
  properties: { NOME: string };
}

const BahiaMap = memo(
  ({ isInteractive = true, highlightedCities = [], selectedCity, setSelectedCity }: BahiaMapProps) => {
    const [hoveredCity, setHoveredCity] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

    useEffect(() => {
      const updateDimensions = () => {
        if (mapRef.current) {
          const rect = mapRef.current.getBoundingClientRect();
          const newWidth = rect.width;
          const newHeight = newWidth * (600 / 800);
          setDimensions({ width: newWidth, height: newHeight });
        }
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const scale = (dimensions.width / 800) * 4000;

    return (
      <Box ref={mapRef} position="relative" overflow="hidden" height="100%" width="100%">
        <ComposableMap
          width={dimensions.width}
          height={dimensions.height}
          projectionConfig={{ scale, center: [-42, -13] }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography="/bahia_municipios.json">
            {({ geographies }: { geographies: GeographyType[] }) =>
              geographies.map((geo) => {
                const isSelected = selectedCity === geo.properties.NOME;
                const isHighlighted = highlightedCities.includes(geo.properties.NOME);
                return (
                  <Tooltip
                    key={geo.rsmKey}
                    label={geo.properties.NOME}
                    hasArrow
                    placement="top"
                    isOpen={hoveredCity === geo.properties.NOME}
                  >
                    <Geography
                      geography={geo}
                      fill={isSelected ? '#29C3FF' : isHighlighted ? '#B1FF00' : '#D7DBD9'}
                      stroke="#000"
                      strokeWidth={isSelected ? 1 : 0.5}
                      onClick={() => isInteractive && setSelectedCity?.(geo.properties.NOME)}
                      onMouseEnter={() => setHoveredCity(geo.properties.NOME)}
                      onMouseLeave={() => setHoveredCity(null)}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#29C3FF', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                      aria-label={`Município ${geo.properties.NOME}, ${isSelected ? 'selecionado' : isHighlighted ? 'destacado' : 'padrão'}`}
                    />
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {selectedCity && (
          <Box
            position="absolute"
            top="10px"
            left="10px"
            bg="bg.surface"
            p={2}
            borderRadius="md"
            boxShadow="md"
            zIndex={10}
          >
            {selectedCity}
          </Box>
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isInteractive === nextProps.isInteractive &&
      prevProps.selectedCity === nextProps.selectedCity &&
      (prevProps.highlightedCities?.length ?? 0) === (nextProps.highlightedCities?.length ?? 0) &&
      (prevProps.highlightedCities && nextProps.highlightedCities
        ? prevProps.highlightedCities.every((city, index) => city === nextProps.highlightedCities![index])
        : true)
    );
  }
);

export default BahiaMap;
