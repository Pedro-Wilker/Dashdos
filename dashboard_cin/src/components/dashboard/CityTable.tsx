import { useState, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TextField,
} from '@mui/material';
import { Download as DownloadIcon, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Box, useTheme } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getAmploGeral } from '../../services/api';
import { downloadCSV } from '../../utils/downloadChart';
import { useAppContext } from '../../contexts/AppContext';
import { useCitySearch } from '../../hooks/useCitySearch';
import { City, Column } from '../../types';

// Restrict SortConfig to keys with safe types, excluding arrays
type SortKey = Exclude<keyof City, 'produtividades_diarias'> | 'produtividade_total';

type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
};

// Define columns with explicit typing
const columns: Column[] = [
  { key: 'nome_municipio', label: 'Município' },
  { key: 'status_visita', label: 'Status Visita' },
  { key: 'status_publicacao', label: 'Status Publicação' },
  { key: 'status_instalacao', label: 'Status Instalação' },
  { key: 'data_visita', label: 'Data Visita' },
  { key: 'data_instalacao', label: 'Data Instalação' },
  { key: 'produtividade_total', label: 'Produtividade Total' },
];

export function CityTable() {
  const { setSelectedCity } = useAppContext();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome_municipio', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch city data
  const { data = [], isLoading } = useQuery<City[], Error>({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await getAmploGeral();
      return response.data.data;
    },
  });

  // Apply search filter using useCitySearch
  const { filteredCities, isSearchLoading, handleSearch } = useCitySearch(data, searchQuery);

  // Sorting logic
  const sortedCities = [...filteredCities].sort((a, b) => {
    let aValue: string | number | boolean | undefined | null;
    let bValue: string | number | boolean | undefined | null;

    if (sortConfig.key === 'produtividade_total') {
      aValue = a.produtividades_diarias?.reduce((sum: number, p) => sum + (p.quantidade || 0), 0) || 0;
      bValue = b.produtividades_diarias?.reduce((sum: number, p) => sum + (p.quantidade || 0), 0) || 0;
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    // Handle undefined/null values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
    if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

    // Handle boolean values
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const aStr = aValue.toString();
      const bStr = bValue.toString();
      return sortConfig.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    }

    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    // Handle number values (including produtividade_total)
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Fallback: convert to strings for mixed types
    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = (city: City) => {
    const data = [
      {
        Nome: city.nome_municipio,
        'Status Visita': city.status_visita || 'N/A',
        'Status Publicação': city.status_publicacao || 'N/A',
        'Status Instalação': city.status_instalacao || 'N/A',
        'Data Visita': city.data_visita || 'N/A',
        'Data Instalação': city.data_instalacao || 'N/A',
        Produtividade: city.produtividades_diarias?.reduce((sum: number, p) => sum + (p.quantidade || 0), 0) || 0,
      },
    ];
    downloadCSV(data, `${city.nome_municipio}_details`);
  };

  if (isLoading || isSearchLoading) return <Box>Loading...</Box>;

  return (
    <Box mt="space.xl" mb="space.xl" px="space.lg">
      <TextField
        label="Pesquisar Município"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        sx={{ mb: '1rem', maxWidth: '400px' }}
        InputLabelProps={{ style: { color: theme.colors.text._light } }}
        InputProps={{ style: { color: theme.colors.text._light } }}
      />
      <TableContainer component={Paper} sx={{ maxHeight: '600px' }}>
        <Table stickyHeader aria-label="Tabela de cidades">
          <TableHead sx={{ backgroundColor: theme.colors.brand[500] }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  sx={{ cursor: 'pointer', color: 'white', fontWeight: 'bold' }}
                >
                  {column.label}
                  {sortConfig.key === column.key &&
                    (sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((city) => (
                <TableRow
                  key={city.nome_municipio}
                  hover
                  onClick={() => setSelectedCity(city.nome_municipio)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{city.nome_municipio}</TableCell>
                  <TableCell>{city.status_visita || 'N/A'}</TableCell>
                  <TableCell>{city.status_publicacao || 'N/A'}</TableCell>
                  <TableCell>{city.status_instalacao || 'N/A'}</TableCell>
                  <TableCell>{city.data_visita || 'N/A'}</TableCell>
                  <TableCell>{city.data_instalacao || 'N/A'}</TableCell>
                  <TableCell>
                    {city.produtividades_diarias?.reduce((sum: number, p) => sum + (p.quantidade || 0), 0) || 0}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(city);
                      }}
                      aria-label={`Baixar CSV para ${city.nome_municipio}`}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </TableContainer>
    </Box>
  );
}