export const exportToCSV = (data: any) => {
  // Add export to CSV logic here
  const csvContent = data.map((row: any) => Object.values(row).join(',')).join('\n');
  return csvContent;
};
