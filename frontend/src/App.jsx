import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import BusinessTypeFilter from './components/BusinessTypeFilter';
import MapView from './components/MapView';
import InsightsPanel from './components/InsightsPanel';
import AnalysisForm from './components/AnalysisForm';
import HistoryDashboard from './components/HistoryDashboard';
import AuthView from './views/AuthView';
import { api } from './api/client';
import { useAuth } from './context/AuthProvider';
import { Sparkles, ChevronRight } from 'lucide-react';

function ReportModal({ report, onClose }) {
  if (!report) return null;
  const { analysis } = report;
  const score = analysis?.score ?? 0;
  return (
    <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className={`p-5 rounded-2xl mb-6 relative overflow-hidden ${score > 60 ? 'bg-brand' : score > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}>
          <div className="absolute -right-4 -bottom-4 opacity-10"><Sparkles className="w-24 h-24" /></div>
          <p className="text-xs font-black uppercase opacity-60 mb-1">{report.category} · {report.location}</p>
          <h2 className="text-2xl font-black text-dark">{report.business_name}</h2>
          <p className="text-dark/70 text-xs mt-1">Opportunity Score: <strong>{score}/100</strong></p>
        </div>
        {analysis?.metrics && (
          <div className="space-y-2 mb-6">
            <p className="text-[10px] uppercase font-black text-white/40">Location Metrics</p>
            {Object.entries(analysis.metrics).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-white/40 capitalize">{k.replace('_', ' ')}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="w-full bg-brand text-dark font-black py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
          Go to Dashboard <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MapApp() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeType, setActiveType] = useState('Hotel');
  const [opportunities, setOpportunities] = useState(null);
  const [trends, setTrends] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('market');
  const [opportunityAnalysis, setOpportunityAnalysis] = useState(null);

  useEffect(() => {
    async function initData() {
      try {
        const [citiesRes, statsRes] = await Promise.all([api.getCities(), api.getStats()]);
        setCities(citiesRes.data);
        setStats(statsRes.data);
        if (citiesRes.data.length > 0) setSelectedCity(citiesRes.data[0]);
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    if (selectedCity && activeType) {
      async function loadOpportunityData() {
        try {
          const [oppsRes, trendsRes, predRes, spotsRes, analysisRes] = await Promise.all([
            api.getOpportunities(selectedCity.id, activeType),
            api.getTrends(selectedCity.id, activeType),
            api.getPrediction(selectedCity.id, activeType),
            api.getHotspots(selectedCity.id),
            api.getOpportunityAnalysis(selectedCity.id),
          ]);
          setOpportunities(oppsRes.data);
          setTrends(trendsRes.data);
          setPrediction(predRes.data);
          setHotspots(spotsRes.data);
          setOpportunityAnalysis(analysisRes.data);
        } catch (err) {
          console.error('Failed to load opportunity data', err);
        }
      }
      loadOpportunityData();
    }
  }, [selectedCity, activeType]);

  const handleCitySelect = async (city) => {
    if (city.id === null) {
      setLoading(true);
      try {
        const res = await api.resolveCity(city.name);
        if (res.data && !res.data.error) {
          const newCity = res.data;
          setCities(prev => prev.find(c => c.id === newCity.id) ? prev : [...prev, newCity]);
          setSelectedCity(newCity);
          setActiveView('market');
        }
      } catch (err) {
        console.error('Resolve city failed', err);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedCity(city);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center flex-1 bg-dark">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-brand font-bold text-[10px] uppercase tracking-tighter animate-pulse">Map</div>
      </div>
      <p className="mt-4 text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Initializing Data Layers...</p>
    </div>
  );

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <SearchBar cities={cities} onCitySelect={handleCitySelect} />
            {opportunities?.is_live && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full w-fit animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                <span className="text-[10px] text-brand font-bold uppercase tracking-wider">Live Market Data Active</span>
              </div>
            )}
          </div>
          <BusinessTypeFilter activeType={activeType} onTypeSelect={setActiveType} />
        </div>
        <div className="flex-1 min-h-0">
          <MapView city={selectedCity} zones={opportunities?.zones} competitors={opportunities?.competitors_list} businessType={activeType} onZoneClick={(zone) => console.log('Zone clicked', zone)} activeView={activeView} setActiveView={setActiveView} />
        </div>
      </div>
      <div className="w-96 shrink-0 h-full">
        <InsightsPanel city={selectedCity} businessType={activeType} stats={stats} trends={trends} opportunities={opportunities} prediction={prediction} hotspots={hotspots} activeView={activeView} setActiveView={setActiveView} analysis={opportunityAnalysis} />
      </div>
    </main>
  );
}

function App() {
  const { user, loading } = useAuth();
  const [appView, setAppView] = useState('map'); // 'map' | 'form' | 'dashboard'
  const [latestReport, setLatestReport] = useState(null);

  const handleReportGenerated = (report) => {
    setLatestReport(report);
    setAppView('dashboard');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-dark">
      <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
    </div>
  );

  if (!user) return <AuthView />;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        onDashboard={() => setAppView('dashboard')}
        onNewAnalysis={() => setAppView('form')}
        view={appView}
      />

      {latestReport && appView === 'dashboard' && (
        <ReportModal report={latestReport} onClose={() => setLatestReport(null)} />
      )}

      {appView === 'map' && <MapApp />}

      {appView === 'form' && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-black">New Business Analysis</h2>
              <p className="text-white/40 text-sm mt-1">Enter your business details to generate an AI-powered opportunity report.</p>
            </div>
            <AnalysisForm onReportGenerated={handleReportGenerated} />
          </div>
        </div>
      )}

      {appView === 'dashboard' && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <HistoryDashboard onNewAnalysis={() => setAppView('form')} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
