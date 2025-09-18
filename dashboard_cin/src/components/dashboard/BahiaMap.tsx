import React, { useState, useRef, useEffect, memo } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

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
      <Box
        ref={mapRef}
        position="relative"
        overflow="hidden"
        height="100%"
        width="100%"
        bg="brand.500"
        borderRadius="md"
        boxShadow="lg"
        p="space.sm"
      >
        <ComposableMap
          width={dimensions.width}
          height={dimensions.height}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            center={[-42, -13]}
            zoom={1}
            minZoom={1}
            maxZoom={5}
            translateExtent={[[-1000, -1000], [1000, 1000]]}
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
                        strokeWidth={isSelected ? 2 : 0.5}
                        onClick={() => isInteractive && setSelectedCity?.(geo.properties.NOME)}
                        onMouseEnter={() => setHoveredCity(geo.properties.NOME)}
                        onMouseLeave={() => setHoveredCity(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#29C3FF', outline: 'none' },
                          pressed: { fill: '#1A93CC', outline: 'none' },
                        }}
                        aria-label={`Município ${geo.properties.NOME}, ${isSelected ? 'selecionado' : isHighlighted ? 'destacado' : 'padrão'}`}
                      />
                    </Tooltip>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
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