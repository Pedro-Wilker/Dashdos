import html2canvas from 'html2canvas';

// Interface for CSV data to ensure type safety
interface CSVData {
  [key: string]: string | number | undefined;
}

// Function to download data as CSV
export const downloadCSV = (data: CSVData[], filename: string): void => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('No data provided for CSV download');
    return;
  }

  // Create CSV content
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','), // Header row
    ...data.map((row) =>
      headers
        .map((key) => {
          const value = row[key] ?? '';
          return `"${String(value).replace(/"/g, '""')}"`; // Escape quotes
        })
        .join(',')
    ),
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Function to download chart as PNG using html2canvas
export const downloadChartAsImage = async (
  ref: React.RefObject<HTMLElement>,
  filename: string
): Promise<void> => {
  if (!ref.current) {
    console.warn('No valid ref provided for chart download');
    return;
  }

  try {
    const canvas = await html2canvas(ref.current, {
      backgroundColor: null, // Transparent background
      scale: 2, // Higher resolution
      useCORS: true, // Handle cross-origin images
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${filename}.png`;
    link.click();
  } catch (error) {
    console.error('Error downloading chart:', error);
  }
};