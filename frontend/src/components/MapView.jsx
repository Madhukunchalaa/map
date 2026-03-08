import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import OpportunityCard from './OpportunityCard';

// Fix Leaflet marker icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function SearchRipple({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 2 });
    }
  }, [center, map]);

  if (!center) return null;

  return (
    <div className="search-ripple-container">
      <CircleMarker
        center={center}
        pathOptions={{
          fillColor: '#FF3D00',
          color: '#FF3D00',
          weight: 1,
          opacity: 0.5,
          fillOpacity: 0.2
        }}
        radius={200}
        className="animate-ripple"
      />
    </div>
  );
}

export default function MapView({ city, zones, competitors, businessType, onZoneClick, activeView, setActiveView }) {
  const center = city ? [city.lat, city.lng] : [19.0760, 72.8777]; // Default to Mumbai

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-dark-border shadow-2xl">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchRipple center={center} />

        {/* Competitor Markers */}
        {competitors && competitors.map((comp, idx) => (
          <CircleMarker
            key={`comp-${idx}`}
            center={[comp.lat, comp.lng]}
            pathOptions={{ color: '#ffffff', fillColor: '#3b82f6', fillOpacity: 0.8, weight: 1 }}
            radius={4}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <p className="text-xs font-bold">{comp.name}</p>
                <div className="flex items-center gap-1 mt-1">
                   <span className="text-[10px] text-white/60">Rating:</span>
                   <span className="text-[10px] text-brand">★ {comp.rating}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Opportunity Zone Markers */}
        {zones && zones.map((zone) => (
          <Marker
            key={`zone-${zone.id}`}
            position={[zone.lat, zone.lng]}
            eventHandlers={{
              click: () => onZoneClick(zone),
            }}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-12 h-12 rounded-full animate-ping opacity-20" style="background-color: ${zone.color}"></div>
                  <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${zone.color}">
                    <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup className="custom-popup">
               <OpportunityCard zone={zone} businessType={businessType} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-dark-card/90 backdrop-blur-md border border-dark-border p-3 rounded-xl shadow-xl flex flex-col gap-2">
        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Market Density</p>
        <button 
          onClick={() => setActiveView('market')}
          className={`flex items-center gap-2 hover:bg-white/5 p-1 rounded transition-colors ${activeView === 'market' ? 'bg-white/5' : ''}`}
        >
           <div className="w-3 h-3 rounded-full bg-opportunity-high" />
           <span className="text-xs text-white/80">AI Opportunity Engine</span>
        </button>
        <button 
          onClick={() => setActiveView('competitors')}
          className={`flex items-center gap-2 hover:bg-white/5 p-1 rounded transition-colors ${activeView === 'competitors' ? 'bg-white/5' : ''}`}
        >
           <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
           <span className="text-xs text-white/80">Competitors List</span>
        </button>
      </div>
    </div>
  );
}
