import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import BusinessTypeFilter from './components/BusinessTypeFilter';
import MapView from './components/MapView';
import InsightsPanel from './components/InsightsPanel';
import AnalysisForm from './components/AnalysisForm';
import HistoryDashboard from './components/HistoryDashboard';
import AuthView from './views/AuthView';
import BottomNav from './components/BottomNav';
import { api } from './api/client';
import { useAuth } from './context/AuthProvider';
import { Sparkles, ChevronRight } from 'lucide-react';

function ReportModal({ report, onClose }) {
  if (!report) return null;
  const { analysis } = report;
  const score = analysis?.score ?? 0;
  
  return (
    <div className="fixed inset-0 bg-dark/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-[40px] p-10 max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 text-brand mb-2">
              <Zap className="w-5 h-5 fill-brand" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em]">Premium AI Blueprint</span>
            </div>
            <h2 className="text-4xl font-black text-white">{report.business_name}</h2>
            <p className="text-white/40 font-bold uppercase text-[12px] tracking-widest mt-2">{report.category} · {report.location}</p>
          </div>
          <div className="text-right">
            <div className={`w-20 h-20 rounded-[24px] flex flex-col items-center justify-center shadow-2xl ${score > 60 ? 'bg-brand text-dark' : score > 30 ? 'bg-yellow-400 text-dark' : 'bg-green-400 text-dark'}`}>
              <span className="text-3xl font-black">{score}</span>
              <span className="text-[8px] font-black uppercase opacity-60">Score</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <section className="bg-dark/40 border border-dark-border rounded-[32px] p-6 space-y-4">
            <h3 className="text-sm font-black text-brand flex items-center gap-2 uppercase tracking-tight">
               <TrendingUp className="w-4 h-4" /> Growth Potential
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Market Saturation</span>
                <span className="text-xs font-bold">{analysis?.metrics?.competitor_count < 5 ? 'Very Low' : 'Moderate'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Projected Demand</span>
                <span className="text-xs font-bold text-brand">Rising (85%)</span>
              </div>
              <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full bg-brand animate-width-fill" style={{ width: '85%' }} />
              </div>
            </div>
          </section>

          <section className="bg-dark/40 border border-dark-border rounded-[32px] p-6 space-y-4">
            <h3 className="text-sm font-black text-brand flex items-center gap-2 uppercase tracking-tight">
               <MapPin className="w-4 h-4" /> Market Landscape
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Primary Footfall</span>
                <span className="text-xs font-bold">Residency Zone</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Density Rating</span>
                <span className="text-xs font-bold">{analysis?.population_density > 10000 ? 'Ultra High' : 'Standard'}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-brand/10 border border-brand/20 rounded-[32px] p-8 mb-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Zap className="w-20 h-20 text-brand" />
           </div>
           <h3 className="text-lg font-black text-brand mb-4">Strategic AI Intelligence</h3>
           <p className="text-sm text-white/80 leading-relaxed font-medium">
             Analysis indicates a <strong>high success probability</strong> for a {report.category} at {report.location}. 
             We recommend focusing on differentiation through service quality, as existing competitors lack strong positive sentiment. 
             Local demand is 24% higher than the city average during evening hours.
           </p>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-white text-dark font-black py-4 rounded-[20px] hover:bg-brand transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-95">
            Save PDF Report
          </button>
          <button onClick={onClose} className="flex-1 bg-dark border border-dark-border text-white/60 font-black py-4 rounded-[20px] hover:text-white transition-all active:scale-95">
            Return home
          </button>
        </div>
      </div>
    </div>
  );
}

function MapApp({ forcedView }) {
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
    if (forcedView) {
      setActiveView(forcedView);
    }
  }, [forcedView]);

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
  return (
    <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full">
      {/* Mobile-only Header */}
      <div className="lg:hidden p-4 border-b border-dark-border bg-dark/40 flex justify-between items-center shrink-0">
        <div>
           <p className="text-[10px] text-brand font-black uppercase tracking-widest">{activeType} Analysis</p>
           <h3 className="text-sm font-bold">{selectedCity?.name || 'Locating...'}</h3>
        </div>
        <div className="flex gap-2">
           <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${opportunities?.is_live ? 'bg-brand/10 text-brand' : 'bg-white/5 text-white/20'}`}>
              {opportunities?.is_live ? 'Live Data' : 'Offline'}
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden order-2 lg:order-1">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <SearchBar cities={cities} onCitySelect={handleCitySelect} />
            </div>
            <div className="overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <BusinessTypeFilter activeType={activeType} onTypeSelect={setActiveType} />
            </div>
          </div>
          <div className="flex-1 min-h-[300px] md:min-h-0 relative">
            <MapView city={selectedCity} zones={opportunities?.zones} competitors={opportunities?.competitors_list} businessType={activeType} onZoneClick={(zone) => console.log('Zone clicked', zone)} activeView={activeView} setActiveView={setActiveView} />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 shrink-0 h-[40vh] lg:h-full border-t lg:border-t-0 lg:border-l border-dark-border order-1 lg:order-2">
        <InsightsPanel city={selectedCity} businessType={activeType} stats={stats} trends={trends} opportunities={opportunities} prediction={prediction} hotspots={hotspots} activeView={activeView} setActiveView={setActiveView} analysis={opportunityAnalysis} />
      </div>
    </main>
  );
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
        onNewAnalysis={(v) => setAppView(v)}
        view={appView}
      />

      <div className="flex-1 overflow-hidden pb-16 md:pb-0">
        {(appView === 'map' || appView === 'competitors') && (
          <MapApp forcedView={appView === 'competitors' ? 'competitors' : null} />
        )}

        {appView === 'form' && (
          <div className="flex-1 h-full overflow-y-auto p-4 md:p-8">
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
          <div className="flex-1 h-full overflow-y-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
              <HistoryDashboard onNewAnalysis={() => setAppView('form')} />
            </div>
          </div>
        )}
      </div>

      <BottomNav
        onDashboard={() => setAppView('dashboard')}
        onNewAnalysis={(v) => setAppView(v)}
        view={appView}
      />
    </div>
  );
}

export default App;
