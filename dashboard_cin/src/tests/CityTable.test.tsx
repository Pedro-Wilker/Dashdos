import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContextProvider } from '../contexts/AppContext';
import {CityTable} from '../components/dashboard/CityTable';
import theme from '../theme';
import * as downloadUtils from '../utils/downloadChart';
import { getAmploGeral } from '../services/api';

jest.mock('../services/api', () => ({
  getAmploGeral: jest.fn().mockResolvedValue({
    data: {
      data: [
        {
          id: 2,
          nome_municipio: 'Salvador',
          status_visita: 'Aprovado',
          status_publicacao: 'publicado',
          status_instalacao: 'instalado',
          data_visita: null,
          data_instalacao: null,
          cidade_visita: true,
          produtividades_diarias: [
            { id: 4044, cin_amplo_geral_id: 2, data: '2025-04-05T00:00:00.000Z', quantidade: 45, createAt: '2025-09-08T21:59:50.529Z', updateAt: '2025-09-08T21:59:50.529Z' },
          ],
        },
        {
          id: 3,
          nome_municipio: 'Feira de Santana',
          status_visita: null,
          status_publicacao: 'aguardando_publicacao',
          status_instalacao: 'aguardando_instalacao',
          data_visita: null,
          data_instalacao: null,
          cidade_visita: false,
          produtividades_diarias: [
            { id: 4045, cin_amplo_geral_id: 3, data: '2025-04-05T00:00:00.000Z', quantidade: 30, createAt: '2025-09-08T21:59:50.529Z', updateAt: '2025-09-08T21:59:50.529Z' },
          ],
        },
      ],
      meta: { count: 2 },
    },
  }),
}));

jest.mock('../hooks/useCitySearch', () => ({
  useCitySearch: (cities: any[], query: string) => ({
    filteredCities: cities.filter((city) => city.nome_municipio.toLowerCase().includes(query.toLowerCase())),
    isSearchLoading: false,
    handleSearch: jest.fn((e) => ({
      filteredCities: cities.filter((city) =>
        city.nome_municipio.toLowerCase().includes(e.target.value.toLowerCase())
      ),
    })),
  }),
}));

describe('CityTable', () => {
  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppContextProvider>
            <MemoryRouter>
              <CityTable />
            </MemoryRouter>
          </AppContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    );

  test('renders city table with data', async () => {
    renderComponent();
    expect(await screen.findByText('Salvador')).toBeInTheDocument();
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  test('renders all column headers', async () => {
    renderComponent();
    const headers = [
      'Município',
      'Status Visita',
      'Status Publicação',
      'Status Instalação',
      'Data Visita',
      'Data Instalação',
      'Produtividade Total',
      'Ações',
    ];
    for (const header of headers) {
      expect(await screen.findByText(header)).toBeInTheDocument();
    }
  });

  test('sorts table by municipality', async () => {
    renderComponent();
    const header = await screen.findByText('Município');
    fireEvent.click(header);
    const rows = await screen.findAllByRole('row');
    expect(rows[1]).toHaveTextContent('Feira de Santana'); // Ascending order
    fireEvent.click(header);
    expect(rows[1]).toHaveTextContent('Salvador'); // Descending order
  });

  test('sorts table by produtividade_total', async () => {
    renderComponent();
    const header = await screen.findByText('Produtividade Total');
    fireEvent.click(header);
    const rows = await screen.findAllByRole('row');
    expect(rows[1]).toHaveTextContent('Salvador'); // 45 > 30, ascending
    fireEvent.click(header);
    expect(rows[1]).toHaveTextContent('Feira de Santana'); // Descending
  });

  test('sorts table by status_visita with null values', async () => {
    renderComponent();
    const header = await screen.findByText('Status Visita');
    fireEvent.click(header);
    const rows = await screen.findAllByRole('row');
    expect(rows[1]).toHaveTextContent('Feira de Santana'); // null comes first in ascending
    fireEvent.click(header);
    expect(rows[1]).toHaveTextContent('Salvador'); // null comes last in descending
  });

  test('filters cities by search', async () => {
    renderComponent();
    const searchInput = screen.getByLabelText('Pesquisar Município');
    fireEvent.change(searchInput, { target: { value: 'Salvador' } });
    expect(await screen.findByText('Salvador')).toBeInTheDocument();
    expect(screen.queryByText('Feira de Santana')).not.toBeInTheDocument();
  });

  test('downloads city data as CSV', async () => {
    const spy = jest.spyOn(downloadUtils, 'downloadCSV').mockImplementation(() => {});
    renderComponent();
    const downloadButton = await screen.findByLabelText('Baixar CSV para Salvador');
    fireEvent.click(downloadButton);
    expect(spy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          Nome: 'Salvador',
          'Status Visita': 'Aprovado',
          Produtividade: 45,
        }),
      ]),
      'Salvador_details'
    );
    spy.mockRestore();
  });
});