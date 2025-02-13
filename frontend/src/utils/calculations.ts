export const calculateScore = (criteria: any) => {
  // Add scoring calculations logic here
  let score = 0;
  // Example calculation
  criteria.forEach((criterion: any) => {
    score += criterion.value;
  });
  return score;
};
