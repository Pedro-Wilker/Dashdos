dashboard_cin/
├── public/
│   ├── bahia_municipios.json
├── src/
│   ├── assets/
│   │   ├── construcao.png
│   │   ├── logo_escuro.png
│   │   ├── logo_claro.png
│   │   ├── logo_sac.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── CityDetails.tsx
│   │   ├── dashboard/
│   │   │   ├── BahiaMap.tsx
│   │   │   ├── CartaTab.tsx
│   │   │   ├── CINTab.tsx
│   │   │   ├── CityList.tsx
│   │   │   ├── CityListModal.tsx
│   │   │   ├── CityTable.tsx
│   │   │   ├── CityDetailsModal.tsx
│   │   │   ├── ConditionalCharts.tsx
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HeatMapSection.tsx
│   │   │   ├── MainSection.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── PieChartSection.tsx
│   │   │   ├── SideBar.tsx
│   │   │   └── Slideshow.tsx
│   │   ├── screens/
│   │   │   ├── AdminScreen.tsx
│   │   │   ├── ArticulacaoScreen.tsx
│   │   │   ├── CapitalScreen.tsx
│   │   │   ├── CartaScreen.tsx
│   │   │   ├── CinDashboardScreen.tsx
│   │   │   ├── DiretoriaScreen.tsx
│   │   │   ├── InteriorScreen.tsx
│   │   │   ├── MovelScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── NgaScreen.tsx
│   │   │   ├── NudScreen.tsx
│   │   │   ├── PlaceHolderScreen.tsx
│   │   │   ├── PontosScreen.tsx
│   │   │   └── SacScreen.tsx
│   │   ├── tab/
│   │   │   ├── CartaTab.tsx
│   │   │   └── CINTab.tsx
│   ├── contexts/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   ├── useCitySearch.ts
│   │   └── useWindowSize.ts
│   ├── pages/  
│   │   ├── HomePage.tsx                        
│   │   ├── InteractivePage.tsx         # Wraps CinDashboard.tsx
│   │   └── SlideshowPage.tsx           # Wraps Slideshow.tsx
│   ├── services/
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── downloadChart.ts
│   ├── tests/
│   │   ├── BahiaMap.test.tsx
│   │   ├── CityListModal.test.tsx
│   │   ├── CINTab.test.tsx
│   │   ├── MainSection.test.tsx
│   │   ├── PieChartSection.test.tsx
│   │   ├── CityTable.test.tsx
│   │   ├── InteractivePage.test.tsx    # New: Tests for InteractivePage
│   │   └── SlideshowPage.test.tsx      # New: Tests for SlideshowPage
│   ├── App.tsx                         # Simplified to handle routing
│   ├── declarations.d.ts
│   ├── index.css
│   ├── theme.ts
│   ├── types.ts
│   ├── main.tsx
│   └── vite.config.ts