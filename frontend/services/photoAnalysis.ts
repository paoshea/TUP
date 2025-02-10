export interface PhotoAnalysisResult {
  conformation: {
    score: number;
    recommendations: string[];
  };
  movement: {
    gaitAnalysis: string;
  };
  breedStandards: {
    compliance: number;
  };
}

export const photoAnalysis = {
  async analyzePhoto(photoUrl: string): Promise<PhotoAnalysisResult> {
    // Mock response for demo
    return {
      conformation: {
        score: 8.5,
        recommendations: [
          'Good overall structure',
          'Strong topline',
          'Well-balanced proportions'
        ]
      },
      movement: {
        gaitAnalysis: 'Fluid movement with good extension and tracking'
      },
      breedStandards: {
        compliance: 92
      }
    };
  }
};