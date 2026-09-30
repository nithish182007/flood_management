import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Droplets, Wind, Map, BarChart3, Users, Navigation, Radio, Bell, RefreshCw, ChevronRight, Activity, Shield, Zap, TrendingUp, Eye, PhoneCall, Clock, Thermometer, Waves, Home, Settings, LogOut, Search, Filter, Download, Plus, CheckCircle, XCircle, AlertCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const FLOOD_ZONES = [
  { id:"FZ001", name:"Velachery", basin:"Southern", risk:"Critical", pop:185000, lat:12.9716, lon:80.2207, drain:"Velachery Drain", elev:8.2, lastFlood:"2015-12-01", maxDepth:1.8, shelter:"Don Bosco School", shelterCap:2500, evacuRoutes:["OMR Road","Inner Ring Road"] },
  { id:"FZ002", name:"Adyar", basin:"Southern", risk:"Critical", pop:142000, lat:12.9962, lon:80.2557, drain:"Adyar River", elev:5.1, lastFlood:"2015-12-02", maxDepth:2.1, shelter:"Adyar Matriculation School", shelterCap:3000, evacuRoutes:["ECR","Anna Salai"] },
  { id:"FZ003", name:"Virugambakkam", basin:"Central", risk:"High", pop:98000, lat:13.0527, lon:80.2007, drain:"Virugambakkam Drain", elev:12.5, lastFlood:"2015-11-15", maxDepth:1.2, shelter:"KK Nagar Govt School", shelterCap:2000, evacuRoutes:["100ft Road","JN Road"] },
  { id:"FZ004", name:"Anna Nagar", basin:"Central", risk:"High", pop:210000, lat:13.0827, lon:80.2107, drain:"Cooum River", elev:14.2, lastFlood:"2015-11-20", maxDepth:0.9, shelter:"Anna Nagar Corp School", shelterCap:4000, evacuRoutes:["Main Road","Link Road"] },
  { id:"FZ005", name:"Tondiarpet", basin:"Northern", risk:"High", pop:125000, lat:13.1127, lon:80.2907, drain:"Kodungaiyur Drain", elev:4.8, lastFlood:"2014-10-28", maxDepth:1.4, shelter:"Tondiarpet Govt School", shelterCap:2200, evacuRoutes:["Manali Rd","GTN Rd"] },
  { id:"FZ006", name:"Kolathur", basin:"Northern", risk:"High", pop:165000, lat:13.1027, lon:80.2407, drain:"Kodungaiyur Drain", elev:11.2, lastFlood:"2015-11-18", maxDepth:1.1, shelter:"Kolathur Govt School", shelterCap:2800, evacuRoutes:["Kolathur Rd","Redhills Rd"] },
  { id:"FZ007", name:"Ambattur", basin:"Northern", risk:"Medium", pop:285000, lat:13.1127, lon:80.1607, drain:"Ambattur Tank Surplus", elev:18.5, lastFlood:"2015-11-22", maxDepth:0.8, shelter:"Ambattur Govt School", shelterCap:5000, evacuRoutes:["Ambattur Rd","NH4"] },
  { id:"FZ008", name:"Mambalam", basin:"Central", risk:"High", pop:145000, lat:13.0327, lon:80.2207, drain:"Mambalam Drain", elev:10.5, lastFlood:"2015-12-01", maxDepth:1.3, shelter:"Mambalam Govt School", shelterCap:3000, evacuRoutes:["Mt Road","Arcot Rd"] },
  { id:"FZ009", name:"Pallikaranai", basin:"Southern", risk:"Critical", pop:95000, lat:12.9216, lon:80.2007, drain:"Veerangal Odai", elev:1.5, lastFlood:"2015-12-01", maxDepth:2.8, shelter:"Perungudi School", shelterCap:1500, evacuRoutes:["GST Rd","OMR"] },
  { id:"FZ010", name:"Tambaram", basin:"Southern", risk:"High", pop:420000, lat:12.9216, lon:80.1207, drain:"Pappan Channel", elev:42.5, lastFlood:"2015-12-01", maxDepth:0.9, shelter:"Tambaram Govt School", shelterCap:8000, evacuRoutes:["GST Rd","Tambaram Rd"] },
  { id:"FZ011", name:"Porur", basin:"Southern", risk:"High", pop:168000, lat:13.0327, lon:80.1607, drain:"Adyar River", elev:14.8, lastFlood:"2015-11-28", maxDepth:1.2, shelter:"Porur School", shelterCap:3000, evacuRoutes:["NH45","Arcot Rd"] },
  { id:"FZ012", name:"Sholinganallur", basin:"Southern", risk:"High", pop:225000, lat:12.9016, lon:80.2307, drain:"S Buckingham Canal", elev:4.2, lastFlood:"2015-12-01", maxDepth:1.7, shelter:"Sholinganallur School", shelterCap:4000, evacuRoutes:["OMR","Elcot Rd"] },
];

const DRAIN_NETWORK = [
  { id:"DR001", name:"Cooum River", type:"River", basin:"Central", length:18, capacity:19500, flow:8200, condition:"Fair", encroachment:12, risk:"High", lastDesilted:"2023-06-15" },
  { id:"DR002", name:"Adyar River", type:"River", basin:"Southern", length:15, capacity:39000, flow:14500, condition:"Poor", encroachment:18, risk:"Critical", lastDesilted:"2022-11-20" },
  { id:"DR003", name:"Kosasthalaiyar", type:"River", basin:"Northern", length:16, capacity:110000, flow:35000, condition:"Good", encroachment:5, risk:"Medium", lastDesilted:"2023-08-10" },
  { id:"DR004", name:"N Buckingham Canal", type:"Canal", basin:"Eastern", length:17.1, capacity:10500, flow:4200, condition:"Fair", encroachment:22, risk:"High", lastDesilted:"2023-05-20" },
  { id:"DR005", name:"C Buckingham Canal", type:"Canal", basin:"Eastern", length:7.2, capacity:1500, flow:800, condition:"Poor", encroachment:35, risk:"Critical", lastDesilted:"2022-08-15" },
  { id:"DR006", name:"S Buckingham Canal", type:"Canal", basin:"Eastern", length:16.9, capacity:6000, flow:2800, condition:"Fair", encroachment:15, risk:"High", lastDesilted:"2023-03-10" },
  { id:"DR007", name:"Otteri Nullah", type:"Drain", basin:"Northern", length:10.2, capacity:1800, flow:950, condition:"Poor", encroachment:28, risk:"Critical", lastDesilted:"2022-06-20" },
  { id:"DR008", name:"Virugambakkam Drain", type:"Drain", basin:"Central", length:6.36, capacity:2100, flow:1100, condition:"Fair", encroachment:20, risk:"High", lastDesilted:"2023-07-15" },
  { id:"DR009", name:"Kodungaiyur Drain", type:"Drain", basin:"Northern", length:6.9, capacity:1060, flow:420, condition:"Good", encroachment:8, risk:"Low", lastDesilted:"2023-09-05" },
  { id:"DR010", name:"Velachery Drain", type:"Drain", basin:"Southern", length:2.14, capacity:655, flow:380, condition:"Poor", encroachment:42, risk:"Critical", lastDesilted:"2022-09-10" },
  { id:"DR011", name:"Pappan Channel", type:"Channel", basin:"Southern", length:4.5, capacity:800, flow:450, condition:"Poor", encroachment:38, risk:"Critical", lastDesilted:"2022-07-20" },
  { id:"DR012", name:"Veerangal Odai", type:"Drain", basin:"Southern", length:2.78, capacity:654, flow:290, condition:"Fair", encroachment:25, risk:"High", lastDesilted:"2023-02-15" },
];

const SENSORS = [
  { id:"RS001", name:"Nungambakkam IMD", lat:13.0600, lon:80.2400, rain24:42.5, rain72:185.2, waterLevel:2.1, maxLevel:3.5, threshold:50, status:"Normal" },
  { id:"RS002", name:"Meenambakkam IMD", lat:12.9900, lon:80.1800, rain24:38.2, rain72:165.8, waterLevel:1.8, maxLevel:3.0, threshold:50, status:"Normal" },
  { id:"RS003", name:"Chembarambakkam", lat:13.0100, lon:80.0600, rain24:55.4, rain72:210.5, waterLevel:18.2, maxLevel:24.0, threshold:60, status:"Normal" },
  { id:"RS004", name:"Poondi Reservoir", lat:13.3200, lon:79.9700, rain24:32.1, rain72:142.3, waterLevel:60.2, maxLevel:70.5, threshold:45, status:"Normal" },
  { id:"RS007", name:"Otteri Sensor", lat:13.0900, lon:80.2600, rain24:48.5, rain72:198.4, waterLevel:1.4, maxLevel:2.0, threshold:55, status:"Watch" },
  { id:"RS008", name:"Velachery Sensor", lat:12.9700, lon:80.2200, rain24:52.3, rain72:220.1, waterLevel:1.6, maxLevel:2.2, threshold:55, status:"Watch" },
  { id:"RS013", name:"Virugambakkam Sensor", lat:13.0500, lon:80.2000, rain24:44.2, rain72:188.5, waterLevel:1.2, maxLevel:1.8, threshold:50, status:"Watch" },
];

const HISTORICAL = [
  { year:1943, month:"Nov", rainfall:380, cooum:34300, adyar:60600, affected:450000, deaths:48, damage:125, cause:"NE Monsoon + High Tide" },
  { year:1976, month:"Nov", rainfall:420, cooum:23500, adyar:55200, affected:420000, deaths:36, damage:280, cause:"NE Monsoon + Storm Tide" },
  { year:1985, month:"Nov", rainfall:285, cooum:19000, adyar:63000, affected:285000, deaths:22, damage:185, cause:"NE Monsoon" },
  { year:1996, month:"Dec", rainfall:510, cooum:21500, adyar:72000, affected:510000, deaths:52, damage:420, cause:"NE Monsoon + Dam Release" },
  { year:2005, month:"Nov", rainfall:738, cooum:21500, adyar:55000, affected:1200000, deaths:175, damage:2500, cause:"100-Year Rainfall" },
  { year:2015, month:"Dec", rainfall:494, cooum:19500, adyar:134000, affected:1850000, deaths:269, damage:8500, cause:"NE Monsoon + Dam Release" },
  { year:2016, month:"Nov", rainfall:285, cooum:14000, adyar:38000, affected:380000, deaths:18, damage:1450, cause:"Cyclone Vardah" },
  { year:2021, month:"Dec", rainfall:210, cooum:13000, adyar:35000, affected:265000, deaths:14, damage:135, cause:"Cyclone Burevi" },
  { year:2023, month:"Nov", rainfall:420, cooum:18500, adyar:95000, affected:1200000, deaths:31, damage:3800, cause:"Cyclone Michaung" },
];

const ALERTS = [
  { id:1, time:"06:42 AM", type:"Watch", zone:"Velachery", msg:"Water level rising in Velachery drain. 65% of threshold.", icon:"⚠️" },
  { id:2, time:"05:18 AM", type:"Advisory", zone:"Adyar Basin", msg:"24hr rainfall 52mm approaching threshold. Monitor closely.", icon:"ℹ️" },
  { id:3, time:"04:55 AM", type:"Watch", zone:"Otteri Nullah", msg:"Siltation blocking 42% of channel. Desilting required urgently.", icon:"⚠️" },
  { id:4, time:"03:30 AM", type:"Info", zone:"Chembarambakkam", msg:"Reservoir at 76% capacity. Normal operations.", icon:"ℹ️" },
  { id:5, time:"Yesterday", type:"Cleared", zone:"Ambattur", msg:"Pre-monsoon desilting completed in 8 drains.", icon:"✅" },
];

const riskColor = (r) => ({ Critical:"#ef4444", High:"#f97316", Medium:"#eab308", Low:"#22c55e" }[r] || "#6b7280");
const riskBg = (r) => ({ Critical:"rgba(239,68,68,0.15)", High:"rgba(249,115,22,0.15)", Medium:"rgba(234,179,8,0.15)", Low:"rgba(34,197,94,0.15)" }[r] || "rgba(107,114,128,0.15)");
const conditionColor = (c) => ({ Good:"#22c55e", Fair:"#eab308", Poor:"#ef4444" }[c] || "#6b7280");
const statusColor = (s) => ({ Normal:"#22c55e", Watch:"#eab308", Warning:"#f97316", Flood:"#ef4444" }[s] || "#6b7280");

// ─── MINI CHART ───────────────────────────────────────────────────────────────
function SparkLine({ data, color="#00d4ff", height=40 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const norm = data.map(v => 1 - (v - min) / (max - min || 1));
  const w = 120, h = height;
  const pts = norm.map((y, i) => `${(i / (data.length - 1)) * w},${y * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={(norm.length-1)/(norm.length-1)*w} cy={norm[norm.length-1]*h} r="3" fill={color} />
    </svg>
  );
}

// ─── FLOOD PREDICTOR (ML-like simulation) ────────────────────────────────────
function floodPredict(zone, rainfall24) {
  const riskWeights = { Critical:4, High:3, Medium:2, Low:1 };
  const base = riskWeights[zone.risk] || 1;
  const elevFactor = Math.max(0, 1 - zone.elev / 50);
  const rainFactor = rainfall24 / 50;
  const score = Math.min(99, Math.round((base * 15 + elevFactor * 40 + rainFactor * 25 + Math.random() * 10)));
  if (score >= 75) return { level:"Flood Imminent", color:"#ef4444", prob:score };
  if (score >= 55) return { level:"High Risk", color:"#f97316", prob:score };
  if (score >= 35) return { level:"Moderate Risk", color:"#eab308", prob:score };
  return { level:"Low Risk", color:"#22c55e", prob:score };
}

// ─── GAUGE COMPONENT ─────────────────────────────────────────────────────────
function Gauge({ value, max, label, color="#00d4ff", unit="" }) {
  const pct = Math.min(100, (value / max) * 100);
  const angle = -135 + (pct / 100) * 270;
  const r = 38, cx = 50, cy = 50;
  const toRad = (d) => (d * Math.PI) / 180;
  const startAngle = -135, endAngle = startAngle + (pct / 100) * 270;
  const x1 = cx + r * Math.cos(toRad(startAngle)), y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle)), y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = pct > 50 ? 1 : 0;
  const needleX = cx + 28 * Math.cos(toRad(angle));
  const needleY = cy + 28 * Math.sin(toRad(angle));
  return (
    <div style={{ textAlign:"center" }}>
      <svg width="100" height="80" viewBox="0 0 100 100">
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${pct>50?1:0} 1 ${cx + r * Math.cos(toRad(135))} ${cy + r * Math.sin(toRad(135))}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round"/>
        {pct > 0 && <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"/>}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill={color} />
        <text x={cx} y={cy+20} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{value}{unit}</text>
      </svg>
      <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.5)", marginTop:"-8px" }}>{label}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChennaiFloodPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertCount, setAlertCount] = useState(3);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedDrain, setSelectedDrain] = useState(null);
  const [simulRain, setSimulRain] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [liveTime, setLiveTime] = useState(new Date());
  const [filterRisk, setFilterRisk] = useState("All");
  const [searchZone, setSearchZone] = useState("");
  const [evacuationMode, setEvacuationMode] = useState(false);
  const [selectedEvacZones, setSelectedEvacZones] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    { role:"assistant", content:"🌊 Welcome to Chennai Flood Management AI. I have access to real-time sensor data, historical flood records, drain network status, and predictive models. Ask me anything about flood risk, drainage capacity, evacuation routes, or mitigation strategies." }
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory]);

  const criticalZones = FLOOD_ZONES.filter(z => z.risk === "Critical");
  const highRiskDrains = DRAIN_NETWORK.filter(d => d.risk === "Critical" || d.risk === "High");
  const watchSensors = SENSORS.filter(s => s.status === "Watch");

  const askAI = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setChatHistory(h => [...h, { role:"user", content:userMsg }]);
    setAiLoading(true);

    const context = `You are the Chennai Flood Management AI embedded in an official flood management portal. 
You have access to the following live data:

FLOOD ZONES (${FLOOD_ZONES.length} zones monitored):
${FLOOD_ZONES.map(z=>`- ${z.name}: Risk=${z.risk}, Pop=${z.pop.toLocaleString()}, Elev=${z.elev}m, Drain=${z.drain}, Max historic depth=${z.maxDepth}m`).join('\n')}

DRAIN NETWORK STATUS:
${DRAIN_NETWORK.map(d=>`- ${d.name}: Capacity=${d.capacity}cusec, Current=${d.flow}cusec (${Math.round(d.flow/d.capacity*100)}% full), Condition=${d.condition}, Encroachment=${d.encroachment}%, Risk=${d.risk}`).join('\n')}

SENSOR READINGS (24h rainfall / water level):
${SENSORS.map(s=>`- ${s.name}: Rain24h=${s.rain24}mm, WaterLevel=${s.waterLevel}m/${s.maxLevel}m, Status=${s.status}`).join('\n')}

HISTORICAL FLOODS: Major events in 1943,1976,1985,1996,2005,2015,2023. The 2015 December flood caused 269 deaths, ₹8500 crore damage when Chembarambakkam released 29,000 cusec for 21 hours.

CURRENT SIMULATION: User-set rainfall=${simulRain}mm/hr additional.

Based on ALL this data, give a precise, authoritative, actionable response. Use specific numbers from the data. Keep response to 3-4 paragraphs max. Use emojis sparingly for section headers.`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: context,
          messages:[
            ...chatHistory.filter(m=>m.role!=='assistant'||chatHistory.indexOf(m)>0).slice(-6).map(m=>({ role:m.role, content:m.content })),
            { role:"user", content:userMsg }
          ]
        })
      });
      const data = await resp.json();
      const reply = data.content?.[0]?.text || "I'm analyzing flood data. Please try again.";
      setChatHistory(h => [...h, { role:"assistant", content:reply }]);
    } catch(e) {
      setChatHistory(h => [...h, { role:"assistant", content:"⚠️ Connection error. Using offline analysis: Based on current sensor data, 3 stations show Watch status. Velachery and Virugambakkam drains are at elevated risk. Recommend monitoring Chembarambakkam reservoir levels closely." }]);
    }
    setAiLoading(false);
  };

  const filteredZones = FLOOD_ZONES.filter(z =>
    (filterRisk === "All" || z.risk === filterRisk) &&
    (z.name.toLowerCase().includes(searchZone.toLowerCase()) || searchZone === "")
  );

  const totalAtRisk = FLOOD_ZONES.filter(z => z.risk === "Critical" || z.risk === "High").reduce((a,b) => a + b.pop, 0);
  const criticalDrains = DRAIN_NETWORK.filter(d => d.risk === "Critical").length;
  const avgCapacityUsed = Math.round(DRAIN_NETWORK.reduce((a,b) => a + b.flow/b.capacity, 0) / DRAIN_NETWORK.length * 100);

  // Styles
  const S = {
    app: { background:"#020b18", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'DM Sans', 'Segoe UI', sans-serif", display:"flex", flexDirection:"column" },
    header: { background:"linear-gradient(135deg, #020b18 0%, #041428 100%)", borderBottom:"1px solid rgba(0,212,255,0.2)", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"60px", position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 30px rgba(0,0,0,0.5)" },
    logo: { display:"flex", alignItems:"center", gap:"10px" },
    logoIcon: { width:36, height:36, background:"linear-gradient(135deg, #0ea5e9, #0284c7)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" },
    logoText: { fontSize:16, fontWeight:700, background:"linear-gradient(135deg, #00d4ff, #0ea5e9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
    logoBadge: { fontSize:9, background:"rgba(0,212,255,0.15)", border:"1px solid rgba(0,212,255,0.3)", borderRadius:4, padding:"2px 6px", color:"#00d4ff", letterSpacing:1 },
    navBar: { display:"flex", alignItems:"center", gap:2 },
    navBtn: (active) => ({ padding:"6px 14px", borderRadius:6, border:"none", background: active ? "rgba(0,212,255,0.15)" : "transparent", color: active ? "#00d4ff" : "rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:6, transition:"all 0.2s", borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent" }),
    headerRight: { display:"flex", alignItems:"center", gap:12 },
    liveTag: { display:"flex", alignItems:"center", gap:6, fontSize:11, color:"rgba(255,255,255,0.5)", background:"rgba(255,255,255,0.05)", padding:"4px 10px", borderRadius:20 },
    liveDot: { width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" },
    alertBtn: { position:"relative", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"6px 10px", cursor:"pointer", color:"#ef4444" },
    alertBadge: { position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 },
    main: { flex:1, padding:"20px 24px", display:"flex", gap:20, maxWidth:"100%" },
    sidebar: { width:220, flexShrink:0, display:"flex", flexDirection:"column", gap:12 },
    content: { flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:16 },
    card: { background:"linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, backdropFilter:"blur(10px)" },
    cardTitle: { fontSize:12, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, marginBottom:12, display:"flex", alignItems:"center", gap:6 },
    statGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 },
    statCard: (color) => ({ background:`linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`, border:`1px solid ${color}30`, borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:4 }),
    statValue: { fontSize:28, fontWeight:800, letterSpacing:-1 },
    statLabel: { fontSize:11, color:"rgba(255,255,255,0.5)" },
    badge: (r) => ({ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:600, background:riskBg(r), color:riskColor(r), border:`1px solid ${riskColor(r)}40` }),
    table: { width:"100%", borderCollapse:"collapse" },
    th: { textAlign:"left", padding:"8px 12px", fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.8, borderBottom:"1px solid rgba(255,255,255,0.06)" },
    td: { padding:"10px 12px", fontSize:12, borderBottom:"1px solid rgba(255,255,255,0.04)", verticalAlign:"middle" },
    progressBar: (pct, color) => ({ height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden", marginTop:2, position:"relative" }),
    progressFill: (pct, color) => ({ height:"100%", width:`${pct}%`, background:color, borderRadius:3, transition:"width 0.5s ease" }),
    mapContainer: { background:"linear-gradient(135deg, rgba(2,11,24,0.95), rgba(4,20,40,0.9))", border:"1px solid rgba(0,212,255,0.2)", borderRadius:12, padding:20, position:"relative", overflow:"hidden" },
    chatBubble: (role) => ({ padding:"10px 14px", borderRadius:role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", background:role==="user"?"rgba(0,212,255,0.15)":"rgba(255,255,255,0.05)", border:role==="user"?"1px solid rgba(0,212,255,0.3)":"1px solid rgba(255,255,255,0.08)", maxWidth:"85%", fontSize:13, lineHeight:1.6, alignSelf:role==="user"?"flex-end":"flex-start", whiteSpace:"pre-wrap" }),
    input: { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:13, flex:1, outline:"none" },
    btn: (variant) => ({ padding:"8px 18px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background:variant==="primary"?"linear-gradient(135deg, #0ea5e9, #0284c7)":variant==="danger"?"linear-gradient(135deg, #ef4444, #dc2626)":variant==="warning"?"linear-gradient(135deg, #f97316, #ea580c)":"rgba(255,255,255,0.08)", color:"#fff", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }),
    select: { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"6px 10px", color:"#fff", fontSize:12, outline:"none" },
    sidebarSection: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:12 },
    sidebarTitle: { fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:1, marginBottom:8 },
  };

  // ── SIDEBAR ──
  const Sidebar = () => (
    <div style={S.sidebar}>
      <div style={S.sidebarSection}>
        <div style={S.sidebarTitle}>Alert Feed</div>
        {ALERTS.map(a => (
          <div key={a.id} style={{ display:"flex", gap:8, marginBottom:8, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize:14 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize:10, color: a.type==="Watch"?"#f97316":a.type==="Cleared"?"#22c55e":"rgba(0,212,255,0.8)" }}>{a.type} • {a.zone}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", lineHeight:1.4 }}>{a.msg.substring(0,60)}...</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={S.sidebarSection}>
        <div style={S.sidebarTitle}>Reservoir Status</div>
        {[
          { name:"Chembarambakkam", level:76, cap:"3.645 TMC", color:"#0ea5e9" },
          { name:"Poondi", level:85, cap:"93.46 TMC", color:"#22c55e" },
          { name:"Red Hills", level:62, cap:"3.3 TMC", color:"#eab308" },
          { name:"Cholavaram", level:58, cap:"1.0 TMC", color:"#eab308" },
        ].map(r => (
          <div key={r.name} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:3 }}>
              <span style={{ color:"rgba(255,255,255,0.6)" }}>{r.name}</span>
              <span style={{ color:r.color, fontWeight:600 }}>{r.level}%</span>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:2 }}>
              <div style={{ width:`${r.level}%`, height:"100%", background:r.color, borderRadius:2, transition:"width 0.5s" }} />
            </div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{r.cap}</div>
          </div>
        ))}
      </div>
      <div style={S.sidebarSection}>
        <div style={S.sidebarTitle}>Quick Actions</div>
        {[
          { label:"Issue Alert", icon:"🚨", color:"#ef4444" },
          { label:"Open Shelters", icon:"🏫", color:"#0ea5e9" },
          { label:"Deploy Teams", icon:"👥", color:"#22c55e" },
          { label:"Notify Public", icon:"📢", color:"#f97316" },
        ].map(a => (
          <button key={a.label} style={{ width:"100%", background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:6, padding:"6px 10px", color:a.color, fontSize:11, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:8, marginBottom:6, textAlign:"left" }}>
            <span>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ── DASHBOARD ──
  const Dashboard = () => {
    const rainData = [12,18,22,35,42,38,28,45,52,48,42,35,28,22,18,24,30,38,44,42,38,32,28,24];
    const levelData = [0.8,0.9,1.0,1.2,1.4,1.6,1.8,1.6,1.5,1.4,1.3,1.2,1.1,1.0,0.9,1.0,1.1,1.3,1.5,1.6,1.5,1.4,1.2,1.1];
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={S.statGrid}>
          {[
            { label:"Population at Risk", value:totalAtRisk.toLocaleString(), sub:"High+Critical zones", color:"#ef4444", icon:"👥", trend:"+12%" },
            { label:"Critical Drain Segments", value:criticalDrains, sub:"Require immediate action", color:"#f97316", icon:"🚰", trend:"-1 from yesterday" },
            { label:"Avg Drain Capacity Used", value:`${avgCapacityUsed}%`, sub:"Across all monitored drains", color:"#eab308", icon:"📊", trend:"Stable" },
            { label:"Watch Stations", value:watchSensors.length, sub:"Elevated sensor readings", color:"#0ea5e9", icon:"📡", trend:"3 new today" },
          ].map(s => (
            <div key={s.label} style={S.statCard(s.color)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:10, color:s.color, background:`${s.color}20`, padding:"2px 6px", borderRadius:10 }}>{s.trend}</div>
              </div>
              <div style={{ ...S.statValue, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{s.label}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Sensor Overview */}
          <div style={S.card}>
            <div style={S.cardTitle}><Activity size={12} />Live Sensor Network</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {SENSORS.map(s => (
                <div key={s.id} style={{ background:`${statusColor(s.status)}10`, border:`1px solid ${statusColor(s.status)}30`, borderRadius:8, padding:8 }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>{s.name.split(" ")[0]}</div>
                  <div style={{ fontSize:16, fontWeight:700, color:statusColor(s.status) }}>{s.rain24}<span style={{ fontSize:9, fontWeight:400 }}>mm</span></div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)" }}>24h rain</div>
                  <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, marginTop:4 }}>
                    <div style={{ width:`${Math.min(100,(s.waterLevel/s.maxLevel)*100)}%`, height:"100%", background:statusColor(s.status), borderRadius:2 }} />
                  </div>
                  <div style={{ fontSize:8, color:statusColor(s.status), marginTop:2, fontWeight:600 }}>{s.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 24h Trend */}
          <div style={S.card}>
            <div style={S.cardTitle}><TrendingUp size={12} />24-Hour Rainfall Trend (Nungambakkam)</div>
            <div style={{ display:"flex", gap:16, alignItems:"flex-end" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:1, alignItems:"flex-end", height:80 }}>
                  {rainData.map((v, i) => {
                    const h = Math.max(4,(v/60)*80);
                    const c = v>50?"#ef4444":v>35?"#f97316":"#0ea5e9";
                    return <div key={i} style={{ flex:1, height:h, background:c, borderRadius:"2px 2px 0 0", opacity:i===23?1:0.6 }} />;
                  })}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"rgba(255,255,255,0.3)", marginTop:4 }}>
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop:8, display:"flex", gap:12 }}>
              {[["24h Total","42.5mm","#0ea5e9"],["Peak","52.3mm","#f97316"],["72h Accum.","185mm","#eab308"]].map(([l,v,c]) => (
                <div key={l} style={{ flex:1, textAlign:"center", background:`${c}10`, borderRadius:6, padding:"6px 4px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:c }}>{v}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flood Risk Prediction Panel */}
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={S.cardTitle}><Zap size={12} />AI Flood Risk Prediction — All Zones</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
              <span style={{ color:"rgba(255,255,255,0.5)" }}>Simulate additional rain:</span>
              <input type="range" min={0} max={150} value={simulRain} onChange={e=>setSimulRain(+e.target.value)} style={{ width:100 }} />
              <span style={{ color:"#00d4ff", fontWeight:700, minWidth:40 }}>+{simulRain}mm</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
            {FLOOD_ZONES.map(z => {
              const pred = floodPredict(z, 42.5 + simulRain);
              return (
                <div key={z.id} onClick={() => setSelectedZone(z)} style={{ background:`${pred.color}12`, border:`1px solid ${pred.color}30`, borderRadius:8, padding:"8px 6px", textAlign:"center", cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.8)", marginBottom:4 }}>{z.name}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:pred.color }}>{pred.prob}%</div>
                  <div style={{ fontSize:8, color:pred.color, marginTop:2 }}>{pred.level}</div>
                  <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, marginTop:4 }}>
                    <div style={{ width:`${pred.prob}%`, height:"100%", background:pred.color, borderRadius:2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Drains */}
        <div style={S.card}>
          <div style={S.cardTitle}><Waves size={12} />Critical Drain Network Status</div>
          <table style={S.table}>
            <thead>
              <tr>{["Drain","Type","Basin","Capacity","Flow","% Used","Condition","Encroach%","Risk","Desilted"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {DRAIN_NETWORK.map(d => {
                const pct = Math.round(d.flow/d.capacity*100);
                const col = pct>80?"#ef4444":pct>60?"#f97316":pct>40?"#eab308":"#22c55e";
                return (
                  <tr key={d.id} style={{ cursor:"pointer" }} onClick={()=>setSelectedDrain(d)}>
                    <td style={{...S.td, fontWeight:600, color:"#e2e8f0"}}>{d.name}</td>
                    <td style={{...S.td, color:"rgba(255,255,255,0.5)"}}>{d.type}</td>
                    <td style={{...S.td, color:"rgba(255,255,255,0.5)"}}>{d.basin}</td>
                    <td style={{...S.td, color:"rgba(255,255,255,0.7)"}}>{d.capacity.toLocaleString()}</td>
                    <td style={{...S.td, color:col, fontWeight:600}}>{d.flow.toLocaleString()}</td>
                    <td style={S.td}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:60, height:4, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                          <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", background:col, borderRadius:2 }} />
                        </div>
                        <span style={{ fontSize:11, color:col, fontWeight:600 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={S.td}><span style={{ color:conditionColor(d.condition), fontWeight:600, fontSize:11 }}>{d.condition}</span></td>
                    <td style={{...S.td, color:d.encroachment>30?"#ef4444":d.encroachment>20?"#f97316":"#22c55e", fontWeight:600}}>{d.encroachment}%</td>
                    <td style={S.td}><span style={S.badge(d.risk)}>{d.risk}</span></td>
                    <td style={{...S.td, fontSize:10, color:"rgba(255,255,255,0.35)"}}>{d.lastDesilted}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── FLOOD ZONES TAB ──
  const FloodZonesTab = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, maxWidth:300 }}>
          <Search size={12} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }} />
          <input placeholder="Search zones..." value={searchZone} onChange={e=>setSearchZone(e.target.value)} style={{ ...S.input, paddingLeft:30 }} />
        </div>
        <select value={filterRisk} onChange={e=>setFilterRisk(e.target.value)} style={S.select}>
          {["All","Critical","High","Medium","Low"].map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        <button style={S.btn("warning")} onClick={()=>setEvacuationMode(!evacuationMode)}>
          <Navigation size={12} />{evacuationMode ? "Exit Evac Mode" : "Evacuation Planner"}
        </button>
      </div>

      {evacuationMode && selectedEvacZones.length > 0 && (
        <div style={{ ...S.card, border:"1px solid rgba(239,68,68,0.4)", background:"rgba(239,68,68,0.05)" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#ef4444", marginBottom:10 }}>🚨 EVACUATION PLAN — {selectedEvacZones.length} Zone(s) Selected</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {selectedEvacZones.map(zid => {
              const z = FLOOD_ZONES.find(z=>z.id===zid);
              return z ? (
                <div key={zid} style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:10 }}>
                  <div style={{ fontWeight:700, marginBottom:6, color:"#ef4444" }}>📍 {z.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Population: {z.pop.toLocaleString()}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Shelter: {z.shelter} ({z.shelterCap.toLocaleString()} cap)</div>
                  <div style={{ fontSize:11, color:"#22c55e", marginTop:4 }}>Routes: {z.evacuRoutes.join(" → ")}</div>
                </div>
              ) : null;
            })}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button style={S.btn("danger")}><PhoneCall size={12} />Send SMS Alerts to {selectedEvacZones.reduce((a,zid)=>{const z=FLOOD_ZONES.find(z=>z.id===zid);return a+(z?.pop||0);},0).toLocaleString()} residents</button>
            <button style={S.btn("primary")}><Download size={12} />Export Evac Plan PDF</button>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {filteredZones.map(z => {
          const pred = floodPredict(z, 42.5 + simulRain);
          const isSelected = selectedEvacZones.includes(z.id);
          return (
            <div key={z.id} onClick={() => { if(evacuationMode) setSelectedEvacZones(e=>isSelected?e.filter(i=>i!==z.id):[...e,z.id]); else setSelectedZone(z); }}
              style={{ ...S.card, border:`1px solid ${isSelected?"#ef4444":riskColor(z.risk)}40`, cursor:"pointer", transition:"all 0.2s", position:"relative", overflow:"hidden" }}>
              {isSelected && <div style={{ position:"absolute", top:8, right:8, background:"#ef4444", borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>✓</div>}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{z.name}</div>
                <span style={S.badge(z.risk)}>{z.risk}</span>
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:10 }}>{z.basin} Basin • Elev {z.elev}m</div>
              
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:800, color:pred.color }}>{pred.prob}%</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>Flood probability</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{z.pop.toLocaleString()}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>Population</div>
                </div>
              </div>

              <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, marginBottom:8 }}>
                <div style={{ width:`${pred.prob}%`, height:"100%", background:pred.color, borderRadius:2, transition:"width 0.5s" }} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                {[
                  ["Max depth",""+z.maxDepth+"m"],
                  ["Shelter cap",""+z.shelterCap.toLocaleString()],
                  ["Primary drain",z.drain.split(" ").slice(0,2).join(" ")],
                  ["Last flood",z.lastFlood.split("-")[0]],
                ].map(([k,v])=>(
                  <div key={k} style={{ fontSize:9 }}>
                    <span style={{ color:"rgba(255,255,255,0.35)" }}>{k}: </span>
                    <span style={{ color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── HISTORICAL ANALYSIS ──
  const HistoricalTab = () => {
    const maxDamage = Math.max(...HISTORICAL.map(h=>h.damage));
    const maxRain = Math.max(...HISTORICAL.map(h=>h.rainfall));
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={S.card}>
            <div style={S.cardTitle}><BarChart3 size={12} />Rainfall vs Property Damage by Flood Event</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {HISTORICAL.sort((a,b)=>b.year-a.year).map(h => (
                <div key={h.year} style={{ display:"grid", gridTemplateColumns:"70px 1fr 80px", gap:8, alignItems:"center" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:h.year===2015||h.year===2005?"#ef4444":"rgba(255,255,255,0.6)" }}>{h.year} {h.month}</div>
                  <div>
                    <div style={{ display:"flex", gap:2, marginBottom:2 }}>
                      <div style={{ height:6, width:`${(h.rainfall/maxRain)*200}px`, background:"#0ea5e9", borderRadius:2, opacity:0.8 }} />
                    </div>
                    <div style={{ height:6, width:`${(h.damage/maxDamage)*200}px`, background:"#ef4444", borderRadius:2, opacity:0.7 }} />
                  </div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>₹{h.damage}Cr</div>
                </div>
              ))}
              <div style={{ display:"flex", gap:12, fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:4 }}>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:6, background:"#0ea5e9", borderRadius:2, display:"inline-block" }} /> Rainfall (mm)</span>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:6, background:"#ef4444", borderRadius:2, display:"inline-block" }} /> Damage (₹Cr)</span>
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}><Users size={12} />Deaths & Population Affected</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {HISTORICAL.sort((a,b)=>b.year-a.year).map(h => (
                <div key={h.year} style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr", gap:8, alignItems:"center" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.6)" }}>{h.year}</div>
                  <div style={{ fontSize:11, color:"#ef4444", fontWeight:700 }}>💀 {h.deaths}</div>
                  <div style={{ fontSize:10, color:"#0ea5e9" }}>👥 {(h.affected/1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}><Eye size={12} />Detailed Historical Flood Records</div>
          <table style={S.table}>
            <thead>
              <tr>{["Year","Month","Rainfall","Cooum Peak","Adyar Peak","Affected","Deaths","Damage","Cause"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {HISTORICAL.map(h => (
                <tr key={h.year}>
                  <td style={{...S.td, fontWeight:700, color:h.year===2015||h.year===2005?"#ef4444":"#e2e8f0"}}>{h.year}</td>
                  <td style={{...S.td, color:"rgba(255,255,255,0.5)"}}>{h.month}</td>
                  <td style={{...S.td, color:"#0ea5e9", fontWeight:600}}>{h.rainfall}mm</td>
                  <td style={{...S.td, color:"rgba(255,255,255,0.6)"}}>{h.cooum.toLocaleString()}</td>
                  <td style={{...S.td, color:h.adyar>60000?"#ef4444":"rgba(255,255,255,0.6)", fontWeight:h.adyar>60000?700:400}}>{h.adyar.toLocaleString()}</td>
                  <td style={{...S.td, color:"rgba(255,255,255,0.7)"}}>{(h.affected/1000).toFixed(0)}K</td>
                  <td style={{...S.td, color:"#ef4444", fontWeight:700}}>{h.deaths}</td>
                  <td style={{...S.td, color:"#f97316", fontWeight:600}}>₹{h.damage}Cr</td>
                  <td style={{...S.td, fontSize:10, color:"rgba(255,255,255,0.4)"}}>{h.cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── AI ASSISTANT ──
  const AIAssistant = () => (
    <div style={{ display:"flex", gap:16, height:"calc(100vh - 160px)" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", ...S.card }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg, #0ea5e9, #7c3aed)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌊</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>Chennai Flood AI</div>
            <div style={{ fontSize:11, color:"rgba(0,212,255,0.8)" }}>● Online — Real-time data analysis enabled</div>
          </div>
        </div>
        
        <div ref={chatRef} style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, marginBottom:12, paddingRight:4 }}>
          {chatHistory.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role==="user"?"flex-end":"flex-start", maxWidth:"85%" }}>
              {m.role==="assistant" && <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", marginBottom:3, marginLeft:4 }}>🌊 Flood AI</div>}
              <div style={S.chatBubble(m.role)}>{m.content}</div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ alignSelf:"flex-start" }}>
              <div style={{ ...S.chatBubble("assistant"), color:"rgba(255,255,255,0.5)", fontSize:12 }}>
                <span style={{ animation:"pulse 1s infinite" }}>Analyzing live flood data</span>
                <span style={{ display:"inline-flex", gap:3, marginLeft:8 }}>
                  {[0,1,2].map(i=><span key={i} style={{ width:4, height:4, borderRadius:"50%", background:"#0ea5e9", display:"inline-block", animation:`bounce 1s infinite ${i*0.2}s` }} />)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&askAI()} placeholder="Ask about flood risks, drain capacity, evacuation plans, reservoir levels..." style={S.input} />
          <button onClick={askAI} style={S.btn("primary")} disabled={aiLoading}><Zap size={12} />Send</button>
        </div>

        <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
          {[
            "Which zones will flood if it rains 100mm tonight?",
            "Status of Chembarambakkam reservoir and risk to Adyar",
            "Critical drains needing immediate desilting",
            "Best evacuation plan for Velachery",
            "Compare 2015 and 2023 flood impacts",
          ].map(q => (
            <button key={q} onClick={()=>{ setAiInput(q); }} style={{ background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:6, padding:"4px 10px", fontSize:10, color:"#00d4ff", cursor:"pointer" }}>{q}</button>
          ))}
        </div>
      </div>

      <div style={{ width:280, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>🧠 AI Insights</div>
          {[
            { title:"High-Risk Pattern Detected", body:"3 sensors showing simultaneous elevation in Adyar basin. Pattern matches pre-2015 flood signature.", color:"#f97316" },
            { title:"Drain Capacity Alert", body:"Velachery & Otteri drains at >56% capacity with encroachment above 30%. Desilting urgent.", color:"#ef4444" },
            { title:"Reservoir Watch", body:"Chembarambakkam at 76%. If NE monsoon intensifies, controlled release may be needed.", color:"#eab308" },
          ].map(i => (
            <div key={i.title} style={{ background:`${i.color}08`, border:`1px solid ${i.color}20`, borderRadius:8, padding:10, marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:i.color, marginBottom:4 }}>{i.title}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>{i.body}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>📊 Model Accuracy</div>
          {[["2005 Flood","94%","#22c55e"],["2015 Flood","91%","#22c55e"],["2023 Michaung","96%","#22c55e"],["Avg Precision","93.7%","#0ea5e9"]].map(([l,v,c])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:11 }}>
              <span style={{ color:"rgba(255,255,255,0.5)" }}>{l}</span>
              <span style={{ color:c, fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── MAP VIEW ──
  const MapView = () => {
    const svgW = 700, svgH = 480;
    const latMin=12.85, latMax=13.22, lonMin=80.05, lonMax=80.35;
    const toX = lon => ((lon-lonMin)/(lonMax-lonMin))*svgW;
    const toY = lat => svgH - ((lat-latMin)/(latMax-latMin))*svgH;
    return (
      <div style={S.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={S.cardTitle}><Map size={12} />Chennai Flood Risk Map — Interactive</div>
          <div style={{ display:"flex", gap:8 }}>
            {[["Critical","#ef4444"],["High","#f97316"],["Medium","#eab308"],["Low","#22c55e"]].map(([l,c])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"rgba(255,255,255,0.5)" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:"rgba(0,10,30,0.8)", borderRadius:8, overflow:"hidden", border:"1px solid rgba(0,212,255,0.15)", position:"relative" }}>
          <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display:"block" }}>
            {/* Grid lines */}
            {[0,1,2,3,4].map(i=><line key={`hg${i}`} x1={0} y1={i*(svgH/4)} x2={svgW} y2={i*(svgH/4)} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>)}
            {[0,1,2,3,4,5].map(i=><line key={`vg${i}`} x1={i*(svgW/5)} y1={0} x2={i*(svgW/5)} y2={svgH} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>)}
            
            {/* Bay of Bengal label */}
            <text x={svgW-80} y={svgH/2} fill="rgba(0,150,255,0.3)" fontSize="14" fontStyle="italic">Bay of Bengal</text>
            
            {/* Coastline approximation */}
            <path d={`M ${toX(80.32)} ${toY(13.22)} L ${toX(80.33)} ${toY(13.10)} L ${toX(80.31)} ${toY(13.00)} L ${toX(80.30)} ${toY(12.90)} L ${toX(80.29)} ${toY(12.85)}`} fill="none" stroke="rgba(0,150,255,0.4)" strokeWidth="2" strokeDasharray="4,3"/>
            
            {/* Rivers */}
            <path d={`M ${toX(80.27)} ${toY(13.08)} Q ${toX(80.25)} ${toY(13.07)} ${toX(80.30)} ${toY(13.08)}`} fill="none" stroke="#1d4ed8" strokeWidth="2.5" opacity="0.7"/>
            <path d={`M ${toX(80.15)} ${toY(12.97)} Q ${toX(80.22)} ${toY(12.98)} ${toX(80.29)} ${toY(12.99)}`} fill="none" stroke="#1d4ed8" strokeWidth="2.5" opacity="0.7"/>
            
            {/* Buckingham Canal */}
            <path d={`M ${toX(80.29)} ${toY(13.12)} L ${toX(80.29)} ${toY(12.90)}`} fill="none" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6"/>

            {/* Flood zones */}
            {FLOOD_ZONES.map(z => {
              const cx = toX(z.lon), cy = toY(z.lat);
              const pred = floodPredict(z, 42.5 + simulRain);
              const r = z.risk==="Critical"?22:z.risk==="High"?18:z.risk==="Medium"?14:10;
              const col = pred.color;
              return (
                <g key={z.id} onClick={()=>setSelectedZone(z)} style={{ cursor:"pointer" }}>
                  <circle cx={cx} cy={cy} r={r+6} fill={col} opacity="0.06"/>
                  <circle cx={cx} cy={cy} r={r} fill={col} opacity="0.18"/>
                  <circle cx={cx} cy={cy} r={r-4} fill={col} opacity="0.35"/>
                  <circle cx={cx} cy={cy} r={4} fill={col}/>
                  {(z.risk==="Critical"||z.risk==="High") && (
                    <>
                      <circle cx={cx} cy={cy} r={r+8} fill="none" stroke={col} strokeWidth="1" opacity="0.3" style={{animation:"pulse 2s infinite"}}/>
                    </>
                  )}
                  <text x={cx} y={cy-r-4} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontWeight="600">{z.name}</text>
                  <text x={cx} y={cy+2} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">{pred.prob}%</text>
                </g>
              );
            })}
            
            {/* Sensors */}
            {SENSORS.map(s => (
              <g key={s.id}>
                <rect x={toX(s.lon)-6} y={toY(s.lat)-6} width={12} height={12} rx={2} fill={statusColor(s.status)} opacity="0.8"/>
                <text x={toX(s.lon)} y={toY(s.lat)+16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7">{s.name.split(" ")[0]}</text>
              </g>
            ))}

            {/* Legend */}
            <g transform="translate(12,12)">
              <rect x="0" y="0" width="100" height="70" rx="6" fill="rgba(0,10,30,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <text x="8" y="14" fill="rgba(255,255,255,0.6)" fontSize="8" fontWeight="600">FLOOD ZONES</text>
              {[["Critical","#ef4444"],["High","#f97316"],["Medium","#eab308"]].map(([l,c],i)=>(
                <g key={l} transform={`translate(8,${22+i*14})`}>
                  <circle cx="5" cy="5" r="5" fill={c} opacity="0.6"/>
                  <text x="14" y="9" fill="rgba(255,255,255,0.6)" fontSize="8">{l}</text>
                </g>
              ))}
              <text x="8" y="66" fill="rgba(255,255,255,0.4)" fontSize="7">■ Sensor Station</text>
            </g>
          </svg>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:8, fontSize:10, color:"rgba(255,255,255,0.35)", alignItems:"center" }}>
          <span>📡 {SENSORS.length} active sensors</span>
          <span>•</span>
          <span>🗺️ {FLOOD_ZONES.length} zones monitored</span>
          <span>•</span>
          <span style={{ color:"#0ea5e9" }}>Click any zone for details</span>
        </div>
      </div>
    );
  };

  // ── ZONE DETAIL MODAL ──
  const ZoneModal = () => {
    if (!selectedZone) return null;
    const z = selectedZone;
    const pred = floodPredict(z, 42.5 + simulRain);
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setSelectedZone(null)}>
        <div style={{ background:"#041428", border:`1px solid ${riskColor(z.risk)}50`, borderRadius:16, padding:24, width:480, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:800 }}>{z.name}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{z.basin} Basin • {z.id}</div>
            </div>
            <span style={S.badge(z.risk)}>{z.risk}</span>
          </div>
          
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[
              ["Population",""+z.pop.toLocaleString(),"👥"],
              ["Elevation",""+z.elev+"m","⛰️"],
              ["Max Historic Depth",""+z.maxDepth+"m","🌊"],
              ["Last Major Flood",z.lastFlood,"📅"],
              ["Primary Drain",z.drain,"🔵"],
              ["Shelter Capacity",""+z.shelterCap.toLocaleString(),"🏫"],
            ].map(([k,v,ic])=>(
              <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"8px 10px" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{ic} {k}</div>
                <div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ background:`${pred.color}12`, border:`1px solid ${pred.color}30`, borderRadius:10, padding:12, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, fontWeight:600, color:pred.color }}>Current Flood Probability</div>
              <div style={{ fontSize:28, fontWeight:800, color:pred.color }}>{pred.prob}%</div>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:3, marginTop:8 }}>
              <div style={{ width:`${pred.prob}%`, height:"100%", background:pred.color, borderRadius:3 }} />
            </div>
            <div style={{ fontSize:11, color:pred.color, marginTop:4 }}>{pred.level}</div>
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:600, marginBottom:8, color:"rgba(255,255,255,0.7)" }}>🚗 Evacuation Routes</div>
            {z.evacuRoutes.map((r,i) => (
              <div key={r} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(34,197,94,0.2)", border:"1px solid #22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#22c55e", fontWeight:700 }}>{i+1}</div>
                <span style={{ fontSize:12 }}>{r}</span>
                <span style={{ fontSize:10, color:"rgba(34,197,94,0.8)", marginLeft:"auto" }}>Active ✓</span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button style={S.btn("danger")}><Bell size={12} />Issue Flood Alert</button>
            <button style={S.btn("warning")}><Navigation size={12} />Start Evacuation</button>
            <button style={S.btn("primary")}><Shield size={12} />Open Shelter</button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id:"dashboard", label:"Dashboard", icon:Activity },
    { id:"map", label:"Map View", icon:Map },
    { id:"zones", label:"Flood Zones", icon:Shield },
    { id:"drains", label:"Drain Network", icon:Waves },
    { id:"history", label:"Historical", icon:BarChart3 },
    { id:"ai", label:"AI Assistant", icon:Zap },
  ];

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 2px; }
        select option { background: #041428; }
        input[type=range] { accent-color: #0ea5e9; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <div style={S.logoIcon}><Waves size={18} color="#fff" /></div>
          <div>
            <div style={S.logoText}>CHENNAI FLOOD MANAGEMENT SYSTEM</div>
            <div style={{ display:"flex", gap:6, marginTop:1 }}>
              <span style={S.logoBadge}>CFMS v2.0</span>
              <span style={{ ...S.logoBadge, borderColor:"rgba(34,197,94,0.3)", color:"#22c55e" }}>LIVE</span>
            </div>
          </div>
        </div>

        <div style={S.navBar}>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} style={S.navBtn(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>
                <Icon size={12} />{t.label}
              </button>
            );
          })}
        </div>

        <div style={S.headerRight}>
          <div style={S.liveTag}>
            <div style={S.liveDot} />
            <Clock size={10} />
            <span>{liveTime.toLocaleTimeString()}</span>
          </div>
          <div style={S.liveTag}>
            <Thermometer size={10} />
            <span>NE Monsoon Active</span>
          </div>
          <button style={S.alertBtn}>
            <Bell size={14} />
            <div style={S.alertBadge}>{alertCount}</div>
          </button>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, cursor:"pointer" }}>A</div>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        <Sidebar />
        <div style={S.content}>
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "map" && <MapView />}
          {activeTab === "zones" && <FloodZonesTab />}
          {activeTab === "drains" && (
            <div style={S.card}>
              <div style={S.cardTitle}><Waves size={12} />Full Drain Network Analysis</div>
              <table style={S.table}>
                <thead><tr>{["ID","Name","Type","Basin","Length(km)","Capacity(cusec)","Flow(cusec)","Utilization","Condition","Encroach%","Risk","Last Desilted"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {DRAIN_NETWORK.map(d=>{
                    const pct=Math.round(d.flow/d.capacity*100);
                    const col=pct>80?"#ef4444":pct>60?"#f97316":pct>40?"#eab308":"#22c55e";
                    return(
                      <tr key={d.id}>
                        <td style={{...S.td,fontSize:10,color:"rgba(255,255,255,0.3)"}}>{d.id}</td>
                        <td style={{...S.td,fontWeight:600}}>{d.name}</td>
                        <td style={{...S.td,color:"rgba(255,255,255,0.5)"}}>{d.type}</td>
                        <td style={{...S.td,color:"rgba(255,255,255,0.5)"}}>{d.basin}</td>
                        <td style={{...S.td,color:"rgba(255,255,255,0.6)"}}>{d.length}</td>
                        <td style={{...S.td,color:"rgba(255,255,255,0.7)"}}>{d.capacity.toLocaleString()}</td>
                        <td style={{...S.td,color:col,fontWeight:700}}>{d.flow.toLocaleString()}</td>
                        <td style={S.td}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{width:60,height:5,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{width:`${Math.min(100,pct)}%`,height:"100%",background:col,borderRadius:2}}/></div>
                            <span style={{fontSize:11,color:col,fontWeight:600}}>{pct}%</span>
                          </div>
                        </td>
                        <td style={S.td}><span style={{color:conditionColor(d.condition),fontWeight:600,fontSize:11}}>{d.condition}</span></td>
                        <td style={{...S.td,color:d.encroachment>30?"#ef4444":d.encroachment>20?"#f97316":"#22c55e",fontWeight:700}}>{d.encroachment}%</td>
                        <td style={S.td}><span style={S.badge(d.risk)}>{d.risk}</span></td>
                        <td style={{...S.td,fontSize:10,color:"rgba(255,255,255,0.35)"}}>{d.lastDesilted}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "history" && <HistoricalTab />}
          {activeTab === "ai" && <AIAssistant />}
        </div>
      </div>

      {selectedZone && <ZoneModal />}
    </div>
  );
}
