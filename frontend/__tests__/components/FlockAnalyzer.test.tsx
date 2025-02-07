import { render, screen, fireEvent } from '../../utils/test-utils';
import { FlockAnalyzer } from '../../components/FlockAnalyzer';
import '@testing-library/jest-dom';

describe('FlockAnalyzer', () => {
  it('renders historical flocks', () => {
    render(<FlockAnalyzer />);
    expect(screen.getByText("Queen Mother's Caithness Flock")).toBeInTheDocument();
  });

  it('allows flock selection', () => {
    render(<FlockAnalyzer />);
    const flock = screen.getByText("Queen Mother's Caithness Flock");
    fireEvent.click(flock);
    
    // Check if flock details are displayed
    expect(screen.getByText('Est. 1952')).toBeInTheDocument();
    expect(screen.getByText('Show Performance')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('displays flock metrics after selection', () => {
    render(<FlockAnalyzer />);
    const flock = screen.getByText("Queen Mother's Caithness Flock");
    fireEvent.click(flock);

    // Check metrics
    expect(screen.getByText('Breeding Success')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('Conformation')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
  });

  it('switches between historical and analysis views', () => {
    render(<FlockAnalyzer />);
    
    // Click analysis tab
    const analysisTab = screen.getByText('Analysis');
    fireEvent.click(analysisTab);
    expect(screen.getByText('Select a flock from the historical data to view detailed analysis.')).toBeInTheDocument();

    // Click historical tab
    const historicalTab = screen.getByText('Historical Data');
    fireEvent.click(historicalTab);
    expect(screen.getByText("Queen Mother's Caithness Flock")).toBeInTheDocument();
  });

  it('displays notable traits', () => {
    render(<FlockAnalyzer />);
    const flock = screen.getByText("Queen Mother's Caithness Flock");
    fireEvent.click(flock);

    expect(screen.getByText('Notable Traits')).toBeInTheDocument();
    expect(screen.getByText('Exceptional breed character, strong maternal lines')).toBeInTheDocument();
  });
});