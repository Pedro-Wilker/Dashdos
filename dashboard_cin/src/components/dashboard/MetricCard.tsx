import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import {
  PresentationChartBarIcon,
  ChartBarIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon: React.ComponentType<any>;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  donutPercentage?: number;
}

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = 'primary',
  donutPercentage,
}: MetricCardProps) => {
  const bgColor = useColorModeValue(
    variant === 'primary' ? 'var(--primary)' : 
    variant === 'secondary' ? 'var(--secondary)' : 
    variant === 'accent' ? 'var(--accent)' : 'var(--success)',
    variant === 'primary' ? 'var(--primary)' : 
    variant === 'secondary' ? 'var(--secondary)' : 
    variant === 'accent' ? 'var(--accent)' : 'var(--success)'
  );
  const textColor = 'white';
  const subTextColor = 'whiteAlpha.900';
  const iconBg = 'whiteAlpha.300';

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      p="space.md"
      boxShadow="var(--shadow-card)"
      _hover={{ boxShadow: 'var(--shadow-lg)', transform: 'scale(1.05)' }}
      transition="all 0.3s ease"
      color={textColor}
      minW={{ base: '160px', md: '180px', lg: '200px' }}
      maxW={{ base: '160px', md: '180px', lg: '200px' }}
      h={{ base: '180px', md: '200px', lg: '220px' }}
      className="card-like"
    >
      <Flex direction="column" justify="space-between" h="100%">
        <Flex justify="space-between" align="start">
          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb="space.xs" color={subTextColor}>
              {title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={subtitle ? 'space.xs' : '0'}>
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </Text>
            {subtitle && (
              <Text fontSize="sm" color={subTextColor}>
                {subtitle}
              </Text>
            )}
          </Box>
          {donutPercentage ? (
            <Box position="relative" w="60px" h="60px" className="donut-chart">
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={subTextColor}
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="white"
                  strokeWidth="12"
                  strokeDasharray={`${donutPercentage * 2.51} ${251.2 - donutPercentage * 2.51}`}
                  strokeDashoffset="62.8"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 0.5s ease, transform 0.5s ease' }}
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="20"
                  fill={textColor}
                >
                  {donutPercentage}%
                </text>
              </svg>
            </Box>
          ) : (
            <Flex
              w="12"
              h="12"
              borderRadius="full"
              bg={iconBg}
              align="center"
              justify="center"
            >
              <Icon className="h-6 w-6" style={{ color: textColor }} />
            </Flex>
          )}
        </Flex>
        {trend && (
          <Flex mt="space.sm" align="center" gap="space.xs">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              px="2"
              py="1"
              borderRadius="full"
              bg={trend.isPositive ? 'green.100' : 'red.100'}
              color={trend.isPositive ? 'green.800' : 'red.800'}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
            <Text fontSize="sm" color={subTextColor}>
              {trend.label}
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default MetricCard;