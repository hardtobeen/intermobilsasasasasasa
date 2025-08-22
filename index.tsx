/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

type View = 'tour' | 'photos' | 'requests' | 'stats' | 'support';
type Theme = 'light' | 'dark';
type StatsData = {
    date: string;
    name: string;
    uv: number;
    avgTime: string;
};

const ICONS = {
    tour: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    photos: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    requests: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M22 12h-6l-2 3h-4l-2-3H2" />
             <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    ),
    stats: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    support: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
};

const INITIAL_STATS_DATA: StatsData[] = [
    { date: '2023-10-20', name: 'Casa Campione A', uv: 45, avgTime: '185s' },
    { date: '2023-10-21', name: 'Casa Campione B', uv: 60, avgTime: '210s' },
    { date: '2023-10-22', name: 'Showroom Principale', uv: 75, avgTime: '240s' },
    { date: '2023-10-23', name: 'Casa Campione A', uv: 55, avgTime: '190s' },
    { date: '2023-10-24', name: 'Casa Campione B', uv: 80, avgTime: '220s' },
    { date: '2023-10-25', name: 'Showroom Principale', uv: 95, avgTime: '260s' },
    { date: '2023-10-26', name: 'Casa Campione A', uv: 65, avgTime: '200s' },
    { date: '2023-10-27', name: 'Showroom Principale', uv: 110, avgTime: '280s' },
    { date: '2023-10-28', name: 'Casa Campione B', uv: 90, avgTime: '230s' },
    { date: '2023-10-29', name: 'Casa Campione A', uv: 70, avgTime: '205s' },
];


const ThemeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        )}
    </button>
);

const NavItem: React.FC<{ view: View; currentView: View; setView: (view: View) => void; children: React.ReactNode }> = ({ view, currentView, setView, children }) => {
    const isActive = view === currentView;
    return (
        <a href="#" className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => setView(view)}>
            {ICONS[view]}
            <span>{children}</span>
        </a>
    );
};

const Sidebar: React.FC<{ currentView: View; setView: (view: View) => void, isOpen: boolean }> = ({ currentView, setView, isOpen }) => (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
            <h1 className="sidebar-logo">Intermobil<span>.</span></h1>
        </div>
        <nav className="sidebar-nav">
            <NavItem view="tour" currentView={currentView} setView={setView}>Virtual Tour</NavItem>
            <NavItem view="photos" currentView={currentView} setView={setView}>Foto</NavItem>
            <NavItem view="requests" currentView={currentView} setView={setView}>Richieste</NavItem>
            <NavItem view="stats" currentView={currentView} setView={setView}>Statistiche</NavItem>
            <NavItem view="support" currentView={currentView} setView={setView}>Supporto</NavItem>
        </nav>
    </aside>
);

const Header: React.FC<{ theme: Theme; toggleTheme: () => void; toggleSidebar: () => void; }> = ({ theme, toggleTheme, toggleSidebar }) => (
    <header className="header">
        <div className="header-left">
             <button className="hamburger-menu" onClick={toggleSidebar} aria-label="Toggle menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 className="header-title">Benvenuto</h2>
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </header>
);

const TourCard: React.FC<{ title: string; imageUrl: string; tourUrl: string; isMain?: boolean }> = ({ title, imageUrl, tourUrl, isMain }) => (
    <div className={`card ${isMain ? 'main-tour-card' : ''}`}>
        <div className="card-preview">
            <img src={imageUrl} alt={title} className="card-preview-image" />
        </div>
        <div className="card-content">
            <h3 className="card-title">{title}</h3>
            <button className="card-button" onClick={() => window.open(tourUrl, '_blank')}>
                Apri Tour
            </button>
        </div>
    </div>
);

const VirtualTourView: React.FC = () => (
    <div className="content-area">
        <section>
            <h2 className="section-title">Showroom Principale</h2>
            <TourCard 
                title="Tour Virtuale dello Showroom"
                imageUrl="https://storage.googleapis.com/static.realsee.ai/show/real_estate_photo/81000/81729_16_1656515082.jpg"
                tourUrl="https://realsee.ai/8VRR9VMa"
                isMain 
            />
        </section>
        <section style={{ marginTop: '2.5rem' }}>
            <h2 className="section-title">Tour Demo</h2>
            <div className="demo-tours-grid">
                <TourCard 
                    title="Casa Campione A"
                    imageUrl="https://storage.googleapis.com/static.realsee.ai/show/real_estate_photo/73000/73111_16_1653315684.jpg"
                    tourUrl="https://realsee.ai/8VRR9VMa"
                />
                <TourCard 
                    title="Casa Campione B"
                    imageUrl="https://storage.googleapis.com/static.realsee.ai/show/real_estate_photo/102000/102280_16_1665414840.jpg"
                    tourUrl="https://realsee.ai/O3eeL37d"
                />
            </div>
        </section>
    </div>
);


const PhotosView: React.FC = () => <div>Photos View</div>;
const RequestsView: React.FC = () => <div>Requests View</div>;

const KPI: React.FC<{ title: string; value: string | number; tooltip: string }> = ({ title, value, tooltip }) => (
    <div className="kpi-card">
        <div className="kpi-info">
            <div className="kpi-title-wrapper">
                <span className="kpi-title">{title}</span>
                <div className="info-icon" title={tooltip}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
            </div>
            <div className="kpi-value">{value}</div>
        </div>
    </div>
);

const Chart: React.FC<{ data: { date: string; uv: number; avgTime: number }[] }> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; data: any } | null>(null);

    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (!data || data.length === 0) {
        return <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Nessun dato da visualizzare</div>;
    }

    const maxUv = Math.max(...data.map(d => d.uv), 0) * 1.1;
    const maxAvgTime = Math.max(...data.map(d => d.avgTime), 0) * 1.1;

    const getX = (index: number) => margin.left + (index / (data.length - 1)) * innerWidth;
    const barWidth = Math.max(1, (innerWidth / data.length) * 0.6);

    const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
        const { left } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const index = Math.min(data.length - 1, Math.max(0, Math.round((x / innerWidth) * (data.length - 1))));
        const d = data[index];
        if (d) {
            setTooltip({ x: getX(index), data: d });
        }
    };

    const handleMouseLeave = () => setTooltip(null);

    return (
        <div className="chart-interaction-wrapper">
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="chart" style={{width: '100%'}}>
                 <defs>
                    <linearGradient id="uvBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="avgTimeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
                         <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                <g className="grid-line-group">
                    {[...Array(5)].map((_, i) => (
                        <line key={i} x1={margin.left} y1={margin.top + (i/4 * innerHeight)} x2={width - margin.right} y2={margin.top + (i/4 * innerHeight)} />
                    ))}
                </g>

                {/* Axes */}
                {data.map((d, i) => (
                    i % Math.ceil(data.length/7) === 0 && <text key={i} className="axis-label" x={getX(i)} y={height - 5}>{d.date}</text>
                ))}
                <text className="axis-label y-axis-label" x={margin.left - 10} y={margin.top + 8}>UV</text>
                <text className="axis-label y-axis-label" x={width - margin.right + 10} textAnchor="start" y={margin.top + 8}>Tempo (s)</text>
                
                {/* Data viz */}
                {data.map((d, i) => (
                    <rect key={`bar-${i}`} className="uv-bar" x={getX(i) - barWidth / 2} y={margin.top + innerHeight - (d.uv/maxUv) * innerHeight} width={barWidth} height={(d.uv/maxUv) * innerHeight} />
                ))}
                <path className="avg-time-area" d={`M${margin.left},${height - margin.bottom} ${data.map((d,i) => `L${getX(i)},${margin.top + innerHeight - (d.avgTime/maxAvgTime)*innerHeight}`).join(' ')} L${width - margin.right},${height-margin.bottom} Z`} />
                <path className="avg-time-line" d={`M${data.map((d,i) => `${getX(i)},${margin.top + innerHeight - (d.avgTime/maxAvgTime)*innerHeight}`).join('L')}`} />
                {data.map((d, i) => (
                    <circle key={`point-${i}`} className="avg-time-point" cx={getX(i)} cy={margin.top + innerHeight - (d.avgTime/maxAvgTime)*innerHeight} r="4" />
                ))}

                {/* Interaction Layer */}
                <rect onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} fill="transparent" />

                {tooltip && (
                    <g transform={`translate(${tooltip.x}, ${margin.top})`}>
                        <line className="tooltip-line" y1="0" y2={innerHeight} />
                        <rect className="tooltip-bg" x={tooltip.x > width / 2 ? -130 : 10} y={10} width="120" height="60" rx="4" />
                        <text className="tooltip-text-date" x={tooltip.x > width / 2 ? -120 : 20} y={30}>{tooltip.data.date}</text>
                        <text className="tooltip-text-uv" x={tooltip.x > width / 2 ? -120 : 20} y={50}><tspan className="tooltip-text-legend-uv">●</tspan> UV: {tooltip.data.uv}</text>
                        <text className="tooltip-text-pv" x={tooltip.x > width / 2 ? -120 : 20} y={65}><tspan className="tooltip-text-legend-pv">●</tspan> Tempo: {tooltip.data.avgTime}s</text>
                    </g>
                )}
            </svg>
        </div>
    );
};


const StatsView: React.FC = () => {
    const [kpis, setKpis] = useState({
        totalTours: 0,
        uniqueVisitors: 0,
        averageTime: "0m 0s",
        totalRequests: 5, // Static for now, not in CSV
    });
    const [chartData, setChartData] = useState<{date: string; uv: number; avgTime: number}[]>([]);
    const [tableData, setTableData] = useState<StatsData[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processStatsData = (data: StatsData[]) => {
        const totalUv = data.reduce((sum, item) => sum + item.uv, 0);
        const totalSessions = data.length;
        const totalTimeSeconds = data.reduce((sum, item) => {
            const timeStr = item.avgTime ? String(item.avgTime).replace('s', '') : '0';
            return sum + (Number.isNaN(parseFloat(timeStr)) ? 0 : parseFloat(timeStr));
        }, 0);
        const averageTime = totalSessions > 0 ? (totalTimeSeconds / totalSessions) : 0;

        const formatTime = (seconds: number) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.round(seconds % 60);
            return `${mins}m ${secs}s`;
        };

        setKpis(prev => ({
            totalTours: new Set(data.map(d => d.name)).size,
            uniqueVisitors: totalUv,
            averageTime: formatTime(averageTime),
            totalRequests: prev.totalRequests,
        }));

        const newChartData = [...data].slice(-30).map(d => ({ // Show last 30 days
            date: d.date.substring(5).replace('-', '/'),
            uv: d.uv,
            avgTime: parseFloat(String(d.avgTime).replace('s', '')) || 0
        }));
        setChartData(newChartData);
        setTableData(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    useEffect(() => {
        processStatsData(INITIAL_STATS_DATA);
    }, []);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
            alert('Per favore, seleziona un file CSV.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                alert('Impossibile leggere il file.');
                return;
            }

            try {
                const lines = text.trim().split(/\r?\n/);
                if (lines.length <= 1) throw new Error("Il file CSV è vuoto o contiene solo l'intestazione.");

                const headers = lines[0].split(',').map(h => h.trim());
                const required = ['Data', 'Nome Tour', 'UV', 'Durata sessione media'];
                required.forEach(h => {
                    if (!headers.includes(h)) throw new Error(`L'intestazione del CSV non è corretta. Manca la colonna: ${h}`);
                });

                const indices = {
                    date: headers.indexOf('Data'),
                    name: headers.indexOf('Nome Tour'),
                    uv: headers.indexOf('UV'),
                    avgTime: headers.indexOf('Durata sessione media'),
                };

                const newData: StatsData[] = lines.slice(1).map((line, i) => {
                    const values = line.split(',');
                    if (values.length < headers.length) return null;
                    const uv = parseInt(values[indices.uv]?.trim(), 10);
                    if (isNaN(uv)) return null;
                    return {
                        date: values[indices.date]?.trim(),
                        name: values[indices.name]?.trim(),
                        uv: uv,
                        avgTime: values[indices.avgTime]?.trim(),
                    };
                }).filter((row): row is StatsData => row !== null);

                if (newData.length === 0) throw new Error("Nessun dato valido trovato nel file CSV.");

                processStatsData(newData);
                alert('Dati importati con successo!');

            } catch (error) {
                alert(`Errore nell'importazione: ${error instanceof Error ? error.message : 'Errore sconosciuto.'}`);
            } finally {
                if (event.target) event.target.value = '';
            }
        };
        reader.onerror = () => {
            alert('Errore nella lettura del file.');
            if (event.target) event.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="content-area">
            <div className="stats-header-filters">
                <div className="filter-group">
                    <label className="filter-label">Intervallo di Date</label>
                    <div className="date-range-selector">
                         <input type="date" className="filter-input" defaultValue="2023-10-01" />
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                         <input type="date" className="filter-input" defaultValue="2023-10-31" />
                    </div>
                </div>
                <div className="filter-actions">
                     <button className="action-button">Esporta</button>
                     <button className="primary-button" onClick={handleImportClick}>Importa CSV</button>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".csv,text/csv" />
                </div>
            </div>

            <div className="kpi-grid">
                <KPI title="Totale Tour" value={kpis.totalTours} tooltip="Numero di tour unici attivi nel periodo." />
                <KPI title="Visitatori Unici (UV)" value={kpis.uniqueVisitors.toLocaleString('it-IT')} tooltip="Numero totale di visitatori unici." />
                <KPI title="Tempo Medio" value={kpis.averageTime} tooltip="Tempo medio di permanenza per sessione." />
                <KPI title="Richieste Totali" value={kpis.totalRequests} tooltip="Numero totale di richieste di informazioni inviate." />
            </div>
            
            <div className="statistical-data-container">
                <div className="chart-header">
                    <h3 className="chart-title">Panoramica Visitatori</h3>
                    <div className="chart-legend">
                        <div className="legend-item"><span className="legend-marker uv"></span>Visitatori Unici (UV)</div>
                        <div className="legend-item"><span className="legend-marker avg-time"></span>Tempo Medio</div>
                    </div>
                </div>
                <Chart data={chartData} />
            </div>

            <div className="table-container">
                <div className="table-header-filters">
                    <h3 className="section-title no-margin">Dati Dettagliati</h3>
                </div>
                <div className="table-wrapper">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Nome Tour</th>
                                <th>Visitatori Unici</th>
                                <th>Tempo Medio</th>
                                <th>Azione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.date}</td>
                                    <td>{row.name}</td>
                                    <td>{row.uv}</td>
                                    <td>{row.avgTime}</td>
                                    <td><a href="#" className="table-action-link">Dettagli</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
const SupportView: React.FC = () => <div>Support View</div>;

const App: React.FC = () => {
    const [view, setView] = useState<View>('tour');
    const [theme, setTheme] = useState<Theme>('light');
    const [isSidebarOpen, setSidebarOpen] = useState(false);


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    }

    const CurrentView = () => {
        switch (view) {
            case 'tour': return <VirtualTourView />;
            case 'photos': return <PhotosView />;
            case 'requests': return <RequestsView />;
            case 'stats': return <StatsView />;
            case 'support': return <SupportView />;
            default: return <VirtualTourView />;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar currentView={view} setView={setView} isOpen={isSidebarOpen} />
            <main className="main-content">
                <Header theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
                <CurrentView />
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
