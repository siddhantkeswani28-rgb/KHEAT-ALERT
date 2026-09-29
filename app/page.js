'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Flame, Waves, Zap, Sun, Activity, Moon, SunMedium,
  MapPin, ShieldAlert, Clock, Database, Printer, Send,
  Users, Hospital, School, Home as HomeIcon, Satellite,
  Radio, AlertTriangle, TrendingUp, Layers, Wind, Droplets, Thermometer,
  ExternalLink, CheckCircle2, Sparkles, Bot, X, Loader2, MessageSquare, Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

const I18N = {
  en: {
    brand: 'KhetAlert', tagline: 'Multi-hazard early warning for Vidarbha',
    nav: { home: 'Home', village: 'Village', alerts: 'Alerts', rescue: 'Rescue Planner', data: 'Data & Methods' },
    hazards: { fire: 'Fire', flood: 'Flood', lightning: 'Lightning', heatwave: 'Heatwave', earthquake: 'Earthquake' },
    topThreat: 'Top threat today', confidence: 'Confidence', source: 'Source', updated: 'Updated',
    disclaimer: 'Experimental system — advisory only. Always follow official IMD / NDMA guidance.',
    riskScore: 'Risk score', next3days: 'Next 1–3 days', whyThis: 'Why this score',
    subscribe: 'Subscribe on Telegram', activeAlerts: 'Active alerts', cutoffRisk: 'Cut-off risk villages',
    printBriefing: 'Print one-page briefing', villagesCovered: 'Villages covered', hazardsTracked: 'Hazards tracked',
    liveNow: 'Live now', modelStatus: 'Model status',
    factors: 'Top factors', population: 'Population', vulnerability: 'Vulnerability',
    quakeNote: 'Earthquakes cannot be predicted. This page shows only recent events and exposure.',
  },
  hi: {
    brand: '\u0916\u0947\u0924\u0905\u0932\u0930\u094d\u091f', tagline: '\u0935\u093f\u0926\u0930\u094d\u092d \u0915\u0947 \u0932\u093f\u090f \u092c\u0939\u0941-\u0906\u092a\u0926\u093e \u092a\u0942\u0930\u094d\u0935 \u091a\u0947\u0924\u093e\u0935\u0928\u0940',
    nav: { home: '\u092e\u0941\u0916\u094d\u092f', village: '\u0917\u093e\u0902\u0935', alerts: '\u091a\u0947\u0924\u093e\u0935\u0928\u0940', rescue: '\u092c\u091a\u093e\u0935 \u092f\u094b\u091c\u0928\u093e', data: '\u0921\u0947\u091f\u093e \u0914\u0930 \u0938\u094d\u0930\u094b\u0924' },
    hazards: { fire: '\u0906\u0917', flood: '\u092c\u093e\u0922\u093c', lightning: '\u092c\u093f\u091c\u0932\u0940', heatwave: '\u0932\u0942', earthquake: '\u092d\u0942\u0915\u0902\u092a' },
    topThreat: '\u0906\u091c \u0915\u093e \u092e\u0941\u0916\u094d\u092f \u0916\u0924\u0930\u093e', confidence: '\u0935\u093f\u0936\u094d\u0935\u093e\u0938', source: '\u0938\u094d\u0930\u094b\u0924', updated: '\u0905\u0902\u0924\u093f\u092e \u0905\u092a\u0921\u0947\u091f',
    disclaimer: '\u092a\u094d\u0930\u092f\u094b\u0917\u093e\u0924\u094d\u092e\u0915 \u092a\u094d\u0930\u0923\u093e\u0932\u0940 — \u0915\u0947\u0935\u0932 \u0938\u0932\u093e\u0939\u0964 \u0906\u0927\u093f\u0915\u093e\u0930\u093f\u0915 IMD/NDMA \u0938\u0942\u091a\u0928\u093e \u0915\u093e \u092a\u093e\u0932\u0928 \u0915\u0930\u0947\u0902\u0964',
    riskScore: '\u091c\u094b\u0916\u093f\u092e \u0938\u094d\u0915\u094b\u0930', next3days: '\u0905\u0917\u0932\u0947 1–3 \u0926\u093f\u0928', whyThis: '\u092f\u0939 \u0938\u094d\u0915\u094b\u0930 \u0915\u094d\u092f\u094b\u0902',
    subscribe: '\u091f\u0947\u0932\u0940\u0917\u094d\u0930\u093e\u092e \u092a\u0930 \u091c\u0941\u095c\u0947\u0902', activeAlerts: '\u0938\u0915\u094d\u0930\u093f\u092f \u091a\u0947\u0924\u093e\u0935\u0928\u093f\u092f\u093e\u0902', cutoffRisk: '\u0915\u091f-\u0911\u092b \u091c\u094b\u0916\u093f\u092e \u0935\u093e\u0932\u0947 \u0917\u093e\u0902\u0935',
    printBriefing: '\u090f\u0915-\u092a\u0943\u0937\u094d\u0920 \u092c\u094d\u0930\u0940\u092b\u093f\u0902\u0917 \u092a\u094d\u0930\u093f\u0902\u091f \u0915\u0930\u0947\u0902', villagesCovered: '\u0917\u093e\u0902\u0935 \u0936\u093e\u092e\u093f\u0932', hazardsTracked: '\u091f\u094d\u0930\u0948\u0915 \u0906\u092a\u0926\u093e\u090f\u0902',
    liveNow: '\u0932\u093e\u0907\u0935', modelStatus: '\u092e\u0949\u0921\u0932 \u0938\u094d\u0925\u093f\u0924\u093f',
    factors: '\u092e\u0941\u0916\u094d\u092f \u0915\u093e\u0930\u0915', population: '\u091c\u0928\u0938\u0902\u0916\u094d\u092f\u093e', vulnerability: '\u0938\u0902\u0935\u0947\u0926\u0928\u0936\u0940\u0932\u0924\u093e',
    quakeNote: '\u092d\u0942\u0915\u0902\u092a \u0915\u093e \u092a\u0942\u0930\u094d\u0935\u093e\u0928\u0941\u092e\u093e\u0928 \u0928\u0939\u0940\u0902 \u0932\u0917\u093e\u092f\u093e \u091c\u093e \u0938\u0915\u0924\u093e\u0964 \u092f\u0939 \u092a\u0943\u0937\u094d\u0920 \u0915\u0947\u0935\u0932 \u0939\u093e\u0932\u093f\u092f\u093e \u0918\u091f\u0928\u093e\u090f\u0902 \u0926\u093f\u0916\u093e\u0924\u093e \u0939\u0948\u0964',
  },
  mr: {
    brand: '\u0936\u0947\u0924\u0905\u0932\u0930\u094d\u091f', tagline: '\u0935\u093f\u0926\u0930\u094d\u092d\u093e\u0938\u093e\u0920\u0940 \u092c\u0939\u0941-\u0906\u092a\u0924\u094d\u0924\u0940 \u092a\u0942\u0930\u094d\u0935 \u0907\u0936\u093e\u0930\u093e',
    nav: { home: '\u092e\u0941\u0916\u094d\u092f', village: '\u0917\u093e\u0935', alerts: '\u0907\u0936\u093e\u0930\u0947', rescue: '\u092c\u091a\u093e\u0935 \u092f\u094b\u091c\u0928\u093e', data: '\u092e\u093e\u0939\u093f\u0924\u0940 \u0935 \u0938\u094d\u0924\u094d\u0930\u094b\u0924' },
    hazards: { fire: '\u0906\u0917', flood: '\u092a\u0942\u0930', lightning: '\u0935\u0940\u091c', heatwave: '\u0909\u0937\u094d\u0923\u0924\u093e\u0932\u0939\u0930', earthquake: '\u092d\u0942\u0915\u0902\u092a' },
    topThreat: '\u0906\u091c\u091a\u093e \u092e\u094b\u0920\u093e \u0927\u094b\u0915\u093e', confidence: '\u0935\u093f\u0936\u094d\u0935\u093e\u0938', source: '\u0938\u094d\u0924\u094d\u0930\u094b\u0924', updated: '\u0905\u0926\u094d\u092f\u092f\u093e\u0935\u0924',
    disclaimer: '\u092a\u094d\u0930\u092f\u094b\u0917\u093e\u0924\u094d\u092e\u0915 \u092a\u094d\u0930\u0923\u093e\u0932\u0940 — \u092b\u0915\u094d\u0924 \u0938\u0932\u094d\u0932\u093e\u0964 \u0905\u0927\u093f\u0915\u0943\u0924 IMD/NDMA \u0938\u0942\u091a\u0928\u093e \u092a\u093e\u0933\u093e\u0964',
    riskScore: '\u091c\u094b\u0916\u0940\u092e \u0917\u0941\u0923', next3days: '\u092a\u0941\u0922\u0940\u0932 1–3 \u0926\u093f\u0935\u0938', whyThis: '\u0917\u0941\u0923 \u0915\u093e?',
    subscribe: '\u091f\u0947\u0932\u093f\u0917\u094d\u0930\u093e\u092e\u0935\u0930 \u091c\u094b\u0921\u093e', activeAlerts: '\u0938\u0915\u094d\u0930\u093f\u092f \u0907\u0936\u093e\u0930\u0947', cutoffRisk: '\u0924\u0941\u091f\u0923\u094d\u092f\u093e\u091a\u094d\u092f\u093e \u0927\u094b\u0915\u094d\u092f\u093e\u0924\u0940\u0932 \u0917\u093e\u0935\u0947',
    printBriefing: '\u090f\u0915-\u092a\u093e\u0928\u0940 \u092c\u094d\u0930\u0940\u092b\u093f\u0902\u0917 \u091b\u093e\u092a\u093e', villagesCovered: '\u0917\u093e\u0935\u0947 \u0938\u092e\u093e\u0935\u093f\u0937\u094d\u091f', hazardsTracked: '\u0906\u092a\u0924\u094d\u0924\u0940 \u091f\u094d\u0930\u0945\u0915',
    liveNow: '\u0932\u093e\u0907\u0935', modelStatus: '\u092e\u0949\u0921\u0947\u0932 \u0938\u094d\u0925\u093f\u0924\u0940',
    factors: '\u092e\u0941\u0916\u094d\u092f \u0918\u091f\u0915', population: '\u0932\u094b\u0915\u0938\u0902\u0916\u094d\u092f\u093e', vulnerability: '\u0938\u0902\u0935\u0947\u0926\u0928\u0936\u0940\u0932\u0924\u093e',
    quakeNote: '\u092d\u0942\u0915\u0902\u092a\u093e\u091a\u093e \u0905\u0902\u0926\u093e\u091c \u0918\u0947\u0924\u093e \u092f\u0947\u0924 \u0928\u093e\u0939\u0940\u0964 \u0939\u0947 \u092a\u093e\u0928 \u092b\u0915\u094d\u0924 \u0905\u0932\u0940\u0915\u0921\u0940\u0932 \u0918\u091f\u0928\u093e \u0926\u093e\u0916\u0935\u0924\u0947\u0964',
  },
}

const HAZARDS = [
  { id: 'fire',       icon: Flame,    color: '#ef4444' },
  { id: 'flood',      icon: Waves,    color: '#3b82f6' },
  { id: 'lightning',  icon: Zap,      color: '#eab308' },
  { id: 'heatwave',   icon: Sun,      color: '#f97316' },
  { id: 'earthquake', icon: Activity, color: '#a855f7' },
]

const VILLAGES = [
  { id: 'nagpur',      name: 'Nagpur',     mr: '\u0928\u093e\u0917\u092a\u0942\u0930',   hi: '\u0928\u093e\u0917\u092a\u0941\u0930',   x: 55, y: 28, pop: 2400000, vuln: 0.35, risks: { fire: 22, flood: 41, lightning: 68, heatwave: 79, earthquake: 12 } },
  { id: 'amravati',    name: 'Amravati',   mr: '\u0905\u092e\u0930\u093e\u0935\u0924\u0940', hi: '\u0905\u092e\u0930\u093e\u0935\u0924\u0940', x: 32, y: 25, pop: 647000, vuln: 0.55, risks: { fire: 34, flood: 28, lightning: 72, heatwave: 88, earthquake: 10 } },
  { id: 'wardha',      name: 'Wardha',     mr: '\u0935\u0930\u094d\u0927\u093e',       hi: '\u0935\u0930\u094d\u0927\u093e',   x: 48, y: 34, pop: 306000, vuln: 0.62, risks: { fire: 41, flood: 55, lightning: 64, heatwave: 82, earthquake: 8 } },
  { id: 'yavatmal',    name: 'Yavatmal',   mr: '\u092f\u0935\u0924\u092e\u093e\u0933',   hi: '\u092f\u0935\u0924\u092e\u093e\u0932', x: 40, y: 40, pop: 116000, vuln: 0.71, risks: { fire: 55, flood: 32, lightning: 75, heatwave: 91, earthquake: 6 } },
  { id: 'akola',       name: 'Akola',      mr: '\u0905\u0915\u094b\u0932\u093e',       hi: '\u0905\u0915\u094b\u0932\u093e',   x: 25, y: 27, pop: 425000, vuln: 0.58, risks: { fire: 38, flood: 22, lightning: 66, heatwave: 89, earthquake: 9 } },
  { id: 'chandrapur',  name: 'Chandrapur', mr: '\u091a\u0902\u0926\u094d\u0930\u092a\u0942\u0930', hi: '\u091a\u0902\u0926\u094d\u0930\u092a\u0941\u0930', x: 62, y: 42, pop: 321000, vuln: 0.68, risks: { fire: 61, flood: 78, lightning: 58, heatwave: 84, earthquake: 11 } },
  { id: 'gadchiroli',  name: 'Gadchiroli', mr: '\u0917\u0921\u091a\u093f\u0930\u094b\u0932\u0940', hi: '\u0917\u0921\u091a\u093f\u0930\u094b\u0932\u0940', x: 72, y: 45, pop: 42000, vuln: 0.82, risks: { fire: 72, flood: 88, lightning: 61, heatwave: 76, earthquake: 14 } },
  { id: 'bhandara',    name: 'Bhandara',   mr: '\u092d\u0902\u0921\u093e\u0930\u093e',   hi: '\u092d\u0902\u0921\u093e\u0930\u093e', x: 66, y: 26, pop: 91000, vuln: 0.51, risks: { fire: 28, flood: 82, lightning: 71, heatwave: 74, earthquake: 10 } },
  { id: 'gondia',      name: 'Gondia',     mr: '\u0917\u094b\u0902\u0926\u093f\u092f\u093e', hi: '\u0917\u094b\u0902\u0926\u093f\u092f\u093e', x: 78, y: 22, pop: 132000, vuln: 0.49, risks: { fire: 26, flood: 74, lightning: 69, heatwave: 72, earthquake: 9 } },
  { id: 'washim',      name: 'Washim',     mr: '\u0935\u093e\u0936\u093f\u092e',       hi: '\u0935\u093e\u0936\u093f\u092e',   x: 22, y: 34, pop: 63000, vuln: 0.66, risks: { fire: 45, flood: 26, lightning: 63, heatwave: 87, earthquake: 7 } },
  { id: 'buldhana',    name: 'Buldhana',   mr: '\u092c\u0941\u0932\u0922\u093e\u0923\u093e', hi: '\u092c\u0941\u0932\u0922\u093e\u0923\u093e', x: 15, y: 22, pop: 67000, vuln: 0.60, risks: { fire: 32, flood: 24, lightning: 60, heatwave: 86, earthquake: 8 } },
]

const ALERTS_SEED = [
  { id:'a1', sev:'red',    hazard:'heatwave', village:'Yavatmal',   en:'Severe heatwave: max 46°C expected. Avoid outdoor work 11 AM – 4 PM.', hi:'\u092d\u0940\u0937\u0923 \u0932\u0942: \u0905\u0927\u093f\u0915\u0924\u092e 46°\u0938\u0947. \u092a\u094d\u0930\u0924\u094d\u092f\u093e\u0936\u093f\u0924\u0964 11–4 \u092c\u091c\u0947 \u092c\u093e\u0939\u0930 \u0915\u093e\u092e \u091f\u093e\u0932\u0947\u0902\u0964', mr:'\u0924\u0940\u0935\u094d\u0930 \u0909\u0937\u094d\u0923\u0924\u093e\u0932\u0939\u0930: \u091c\u093e\u0938\u094d\u0924\u0940\u0924 46°\u0938\u0947. \u0936\u0915\u094d\u092f\u0964 11–4 \u092c\u093e\u0939\u0947\u0930 \u0915\u093e\u092e \u091f\u093e\u0933\u093e\u0964', when:'2h ago', source:'IMD Nagpur' },
  { id:'a2', sev:'orange', hazard:'flood',    village:'Gadchiroli', en:'Wainganga discharge crossing warning level in 18 hrs.', hi:'\u0935\u0948\u0928\u0917\u0902\u0917\u093e \u091c\u0932-\u092a\u094d\u0930\u0935\u093e\u0939 18 \u0918\u0902\u091f\u0947 \u092e\u0947\u0902 \u091a\u0947\u0924\u093e\u0935\u0928\u0940 \u0938\u094d\u0924\u0930 \u092a\u093e\u0930 \u0915\u0930\u0947\u0917\u093e\u0964', mr:'\u0935\u0948\u0928\u0917\u0902\u0917\u093e \u092a\u093e\u0923\u0940\u092a\u094d\u0930\u0935\u093e\u0939 18 \u0924\u093e\u0938\u093e\u0902\u0924 \u0907\u0936\u093e\u0930\u093e \u092a\u093e\u0924\u0933\u0940 \u092a\u093e\u0930 \u0915\u0930\u0947\u0932\u0964', when:'40 min ago', source:'CWC / Open-Meteo' },
  { id:'a3', sev:'yellow', hazard:'lightning',village:'Wardha',     en:'Elevated CAPE > 2500 J/kg. Lightning likely 4–8 PM.', hi:'CAPE > 2500 J/kg. \u0936\u093e\u092e 4–8 \u092c\u091c\u0947 \u092c\u093f\u091c\u0932\u0940 \u0938\u0902\u092d\u093e\u0935\u094d\u092f\u0964', mr:'CAPE > 2500 J/kg. \u0938\u093e\u092f\u0902\u0915\u093e\u0933\u0940 4–8 \u0935\u0940\u091c \u0936\u0915\u094d\u092f.', when:'1h ago', source:'Open-Meteo' },
  { id:'a4', sev:'red',    hazard:'fire',     village:'Chandrapur', en:'VIIRS active fires detected 6 km NW of Tadoba buffer.', hi:'VIIRS \u0938\u0915\u094d\u0930\u093f\u092f \u0906\u0917: \u0924\u093e\u0921\u094b\u092c\u093e \u0938\u0947 6 \u0915\u093f\u092e\u0940 \u0909\u0924\u094d\u0924\u0930-\u092a\u0936\u094d\u091a\u093f\u092e\u0964', mr:'VIIRS \u0938\u0915\u094d\u0930\u093f\u092f \u0906\u0917: \u0924\u093e\u0921\u094b\u092c\u093e\u092a\u093e\u0938\u0942\u0928 6 \u0915\u093f\u092e\u0940 \u0909\u0924\u094d\u0924\u0930-\u092a\u0936\u094d\u091a\u093f\u092e.', when:'25 min ago', source:'NASA FIRMS' },
  { id:'a5', sev:'orange', hazard:'flood',    village:'Bhandara',   en:'Gosikhurd reservoir at 92% capacity; downstream advisory.', hi:'\u0917\u094b\u0938\u0940\u0916\u0941\u0930\u094d\u0926 \u091c\u0932\u093e\u0936\u092f 92% \u092d\u0930\u093e; \u0928\u093f\u091a\u0932\u0947 \u0917\u093e\u0902\u0935 \u0938\u093e\u0935\u0927\u093e\u0928\u0964', mr:'\u0917\u094b\u0938\u0940\u0916\u0941\u0930\u094d\u0926 \u091c\u0932\u093e\u0936\u092f 92%; \u0916\u093e\u0932\u091a\u093e \u0907\u0936\u093e\u0930\u093e.', when:'3h ago', source:'CWC' },
]

const SHELTERS = [
  { id:'s1', name:'ZP School Wadsa',           type:'school',   cap:420 },
  { id:'s2', name:'Rural Hospital Desaiganj',  type:'hospital', cap:80 },
  { id:'s3', name:'Community Hall Armori',     type:'shelter',  cap:250 },
  { id:'s4', name:'PHC Bhandara',              type:'hospital', cap:120 },
  { id:'s5', name:'ZP School Pauni',           type:'school',   cap:300 },
]

const DATA_SOURCES = [
  { name:'NASA FIRMS (VIIRS active fires)', url:'https://firms.modaps.eosdis.nasa.gov/', hazard:'fire',  freq:'3h',       updated:'12 min ago', limit:'Cloud cover can mask detections; small fires < ~375 m may be missed.' },
  { name:'Open-Meteo forecast (temp/humidity/wind/rain/CAPE)', url:'https://open-meteo.com/', hazard:'weather', freq:'3h',   updated:'8 min ago',  limit:'~11 km grid; local microclimates not resolved.' },
  { name:'Open-Meteo Flood API (river discharge)', url:'https://open-meteo.com/en/docs/flood-api', hazard:'flood', freq:'3h', updated:'8 min ago',  limit:'GloFAS-based; small tributaries under-represented.' },
  { name:'USGS Earthquake GeoJSON feed', url:'https://earthquake.usgs.gov/earthquakes/feed/', hazard:'earthquake', freq:'3h', updated:'21 min ago', limit:'M >= 2.5 for India region; earthquakes cannot be predicted.' },
  { name:'OpenStreetMap Overpass (hospitals/schools/shelters)', url:'https://overpass-api.de/', hazard:'infra', freq:'weekly', updated:'2 days ago', limit:'Volunteer-mapped; coverage gaps in remote tehsils.' },
  { name:'IMD Nagpur (official warnings)', url:'https://mausam.imd.gov.in/nagpur/', hazard:'weather', freq:'realtime', updated:'34 min ago', limit:'Authoritative source; always defer to IMD text.' },
]

const riskColor = (v) => v >= 70 ? 'risk-red' : v >= 50 ? 'risk-orange' : v >= 30 ? 'risk-yellow' : 'risk-green'
const riskLabel = (v) => v >= 70 ? 'High' : v >= 50 ? 'Elevated' : v >= 30 ? 'Moderate' : 'Low'
const sevBg = { red:'border-red-500/60 bg-red-500/10', orange:'border-orange-500/60 bg-orange-500/10', yellow:'border-yellow-500/60 bg-yellow-500/10' }

/* ============== AI ASSISTANT (Claude) ============== */
function AIAssistant({ open, onClose, lang, village, hazard, t }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [sessionId] = useState(() => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())))
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, busy])

  useEffect(() => {
    if (open && messages.length === 0) {
      const greet = {
        en: `Hello — I'm the KhetAlert AI assistant. I can explain the current ${t.hazards[hazard]} risk for ${village?.name || 'your village'}, translate alerts, or answer safety questions. Ask me anything.`,
        hi: `\u0928\u092e\u0938\u094d\u0924\u0947 — \u092e\u0948\u0902 \u0916\u0947\u0924\u0905\u0932\u0930\u094d\u091f AI \u0938\u0939\u093e\u092f\u0915 \u0939\u0942\u0902\u0964 ${village?.name || '\u0906\u092a\u0915\u0947 \u0917\u093e\u0902\u0935'} \u0915\u0947 \u0932\u093f\u090f \u092e\u094c\u091c\u0942\u0926\u093e ${t.hazards[hazard]} \u091c\u094b\u0916\u093f\u092e \u0938\u092e\u091d\u093e \u0938\u0915\u0924\u093e \u0939\u0942\u0902, \u091a\u0947\u0924\u093e\u0935\u0928\u0940 \u0905\u0928\u0941\u0935\u093e\u0926 \u0915\u0930 \u0938\u0915\u0924\u093e \u0939\u0942\u0902, \u092f\u093e \u0938\u0941\u0930\u0915\u094d\u0937\u093e-\u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0902 \u0915\u093e \u0909\u0924\u094d\u0924\u0930 \u0926\u0947 \u0938\u0915\u0924\u093e \u0939\u0942\u0902\u0964`,
        mr: `\u0928\u092e\u0938\u094d\u0915\u093e\u0930 — \u092e\u0940 \u0936\u0947\u0924\u0905\u0932\u0930\u094d\u091f AI \u0938\u0939\u093e\u092f\u094d\u092f\u0915 \u0906\u0939\u0947. ${village?.name || '\u0906\u092a\u0932\u094d\u092f\u093e \u0917\u093e\u0935\u093e'}\u091a\u094d\u092f\u093e \u0906\u091c\u091a\u094d\u092f\u093e ${t.hazards[hazard]} \u091c\u094b\u0916\u092e\u0940\u092c\u0926\u094d\u0926\u0932 \u0938\u094b\u092a\u094d\u092f\u093e \u092d\u093e\u0937\u0947\u0924 \u0938\u093e\u0902\u0917\u0942 \u0936\u0915\u0924\u094b, \u0907\u0936\u093e\u0930\u0947 \u092d\u093e\u0937\u093e\u0902\u0924\u0930\u093f\u0924 \u0915\u0930\u0924\u094b, \u0915\u093f\u0902\u0935\u093e \u0938\u0941\u0930\u0915\u094d\u0937\u093e-\u092a\u094d\u0930\u0936\u094d\u0928\u093e\u0902\u091a\u0947 \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0924\u094b.`,
      }[lang]
      setMessages([{ role: 'assistant', text: greet }])
    }
  }, [open])

  const askAI = async (question, kind = 'safety') => {
    if (!question.trim() || busy) return
    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput(''); setBusy(true)
    try {
      const hazardCtx = village ? {
        village: village.name, hazard,
        riskScore: village.risks[hazard], population: village.pop,
        vulnerabilityIndex: village.vuln, updatedMinutesAgo: 8, confidence: 0.78,
      } : null
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, question, language: lang, hazard: hazardCtx, sessionId })
      })
      const data = await res.json()
      const text = data.answer || data.error || 'No response.'
      setMessages((m) => [...m, { role: 'assistant', text, model: data.model }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error — please try again.' }])
    } finally { setBusy(false) }
  }

  if (!open) return null

  const suggestions = {
    en: [
      `Explain the ${t.hazards[hazard]} risk for ${village?.name || 'this village'}`,
      `What should farmers do in the next 24 hours?`,
      `Translate "Take shelter and move livestock to higher ground" into Marathi`,
    ],
    hi: [
      `${village?.name || '\u0907\u0938 \u0917\u093e\u0902\u0935'} \u0915\u0947 \u0932\u093f\u090f ${t.hazards[hazard]} \u091c\u094b\u0916\u093f\u092e \u0938\u092e\u091d\u093e\u090f\u0902`,
      `\u0905\u0917\u0932\u0947 24 \u0918\u0902\u091f\u094b\u0902 \u092e\u0947\u0902 \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u094b \u0915\u094d\u092f\u093e \u0915\u0930\u0928\u093e \u091a\u093e\u0939\u093f\u090f?`,
      `"\u092a\u0936\u0941\u0913\u0902 \u0915\u094b \u090a\u0902\u091a\u0947 \u0938\u094d\u0925\u093e\u0928 \u092a\u0930 \u0932\u0947 \u091c\u093e\u090f\u0902" \u0915\u093e \u092e\u0930\u093e\u0920\u0940 \u092e\u0947\u0902 \u0905\u0928\u0941\u0935\u093e\u0926`,
    ],
    mr: [
      `${village?.name || '\u092f\u093e \u0917\u093e\u0935\u093e'}\u0938\u093e\u0920\u0940 ${t.hazards[hazard]} \u091c\u094b\u0916\u092e\u0940 \u0938\u092e\u091c\u093e\u0935\u0942\u0928 \u0938\u093e\u0902\u0917\u093e`,
      `\u092a\u0941\u0922\u0940\u0932 24 \u0924\u093e\u0938\u093e\u0902\u0924 \u0936\u0947\u0924\u0915\u0930\u094d\u092f\u093e\u0902\u0928\u0940 \u0915\u093e\u092f \u0915\u0930\u093e\u0935\u0947?`,
      `"\u0917\u0941\u0930\u0947 \u0909\u0902\u091a \u091c\u093e\u0917\u0940 \u0928\u0947\u093e" \u0939\u0947 \u0939\u093f\u0902\u0926\u0940\u0924 \u092d\u093e\u0937\u093e\u0902\u0924\u0930\u093f\u0924 \u0915\u0930\u093e`,
    ],
  }[lang]

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
      <div onClick={(e)=>e.stopPropagation()}
        className="relative w-full md:w-[440px] h-[85vh] md:h-[92vh] md:mr-6 bg-card/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3 bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center shadow-lg shadow-cyan-500/40">
            <Bot className="w-5 h-5 text-white"/>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 pulse-glow"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold flex items-center gap-2">KhetAlert AI <Badge variant="outline" className="text-[10px] gap-1"><Sparkles className="w-2.5 h-2.5"/>Claude Sonnet 4.6</Badge></div>
            <div className="text-[11px] text-muted-foreground truncate">{village?.name || '—'} · {t.hazards[hazard]} · {lang.toUpperCase()}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4"/></Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role==='user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white"/>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                m.role==='user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white"/>
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin"/> Thinking…
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => askAI(s, i===2 ? 'translate' : i===0 ? 'explain' : 'safety')}
                className="text-[11px] px-3 py-1.5 rounded-full glass hover:bg-primary hover:text-primary-foreground transition text-left">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t bg-background/50">
          <div className="flex gap-2 items-end">
            <Textarea value={input} onChange={(e)=>setInput(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); askAI(input) } }}
              placeholder={lang==='mr' ? 'तुमचा प्रश्न लिहा…' : lang==='hi' ? 'अपना प्रश्न लिखें…' : 'Ask about hazards, safety, translation…'}
              className="min-h-[42px] max-h-[120px] resize-none text-sm"/>
            <Button size="icon" onClick={()=>askAI(input)} disabled={busy || !input.trim()} className="shrink-0">
              {busy ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
            </Button>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3"/> AI-generated. Not a substitute for official IMD/NDMA alerts.
          </div>
        </div>
      </div>
    </div>
  )
}

function CycloneHero() {
  return (
    <div className="relative w-full h-[480px] md:h-[560px] rounded-3xl overflow-hidden glass shadow-2xl map-container">
      <div className="absolute inset-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1591360607974-ca109f8d5996?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600')`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.55) saturate(1.2)' }}/>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-blue-950/40 to-black/70"/>
      <div className="absolute inset-0 grid-bg opacity-40"/>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line absolute inset-x-0 h-48 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"/>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] pointer-events-none">
        <div className="absolute inset-0 rounded-full swirl-slow" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(56,189,248,0.35) 60deg, transparent 120deg, rgba(56,189,248,0.25) 200deg, transparent 260deg, rgba(56,189,248,0.35) 320deg, transparent 360deg)', filter:'blur(14px)' }}/>
        <div className="absolute inset-8 rounded-full swirl-med" style={{ background: 'conic-gradient(from 90deg, transparent 0deg, rgba(255,255,255,0.55) 40deg, transparent 100deg, rgba(255,255,255,0.35) 180deg, transparent 240deg, rgba(255,255,255,0.5) 300deg, transparent 360deg)', filter:'blur(8px)' }}/>
        <div className="absolute inset-24 rounded-full swirl-fast" style={{ background: 'conic-gradient(from 180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1), rgba(255,255,255,0.9))', filter:'blur(4px)', opacity:.7 }}/>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900 border-2 border-cyan-300/60 shadow-[0_0_60px_20px_rgba(56,189,248,0.6)]"/>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black"/>
      </div>
      <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
        <Badge className="bg-red-500/90 text-white border-0 gap-1.5 backdrop-blur">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"/><span className="relative inline-flex rounded-full h-2 w-2 bg-white"/></span>
          LIVE
        </Badge>
        <Badge variant="outline" className="bg-slate-900/70 text-white border-white/20 backdrop-blur gap-1.5"><Satellite className="w-3 h-3"/>VIIRS · GOES-16</Badge>
        <Badge variant="outline" className="bg-slate-900/70 text-white border-white/20 backdrop-blur">Cyclone &apos;BIPARJOY-II&apos; (simulated)</Badge>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 z-10">
        <div className="text-white max-w-xl">
          <div className="text-xs uppercase tracking-widest text-cyan-300/90 mb-2">Arabian Sea → Vidarbha corridor</div>
          <h2 className="text-3xl md:text-5xl font-bold neon-text">Category 3 · 145 km/h</h2>
          <p className="text-white/80 text-sm mt-2">Projected landfall path shows a secondary heavy rainfall band reaching Vidarbha in ~54 hours. Simulated data for demonstration.</p>
        </div>
        <div className="hidden md:flex flex-col gap-2 text-right text-white/90 text-sm">
          <div className="flex items-center gap-2 justify-end"><Wind className="w-4 h-4"/>Wind 145 km/h</div>
          <div className="flex items-center gap-2 justify-end"><Droplets className="w-4 h-4"/>Rain 220 mm/24h</div>
          <div className="flex items-center gap-2 justify-end"><Thermometer className="w-4 h-4"/>Pressure 962 hPa</div>
        </div>
      </div>
    </div>
  )
}

function VidarbhaMap({ hazard, onSelect, selected, t }) {
  const hz = HAZARDS.find(h => h.id === hazard)
  return (
    <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden glass map-container">
      <div className="absolute inset-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516822277566-bb38424a2b77?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600')`, backgroundSize:'cover', backgroundPosition:'center', filter:'saturate(1.1) brightness(0.75)' }}/>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-transparent to-slate-950/70"/>
      <div className="absolute inset-0 grid-bg opacity-30"/>
      <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={hz.color} stopOpacity="0.7"/>
            <stop offset="100%" stopColor={hz.color} stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5"/>
          </linearGradient>
        </defs>
        <path d="M8,20 L18,12 L32,10 L48,12 L62,10 L78,14 L88,20 L86,32 L82,44 L74,52 L60,54 L46,50 L34,52 L22,46 L14,36 Z" fill="rgba(15,23,42,0.35)" stroke="rgba(56,189,248,0.6)" strokeWidth="0.4" strokeDasharray="1 1"/>
        <path className="dash-flow" d="M8,30 Q30,35 55,28 T90,32" stroke="url(#riverGrad)" strokeWidth="0.6" fill="none"/>
        <path className="dash-flow" d="M20,45 Q40,42 62,44 T85,46" stroke="url(#riverGrad)" strokeWidth="0.5" fill="none"/>
        {hazard === 'flood' && <path d="M2,15 Q30,10 55,28" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="1.5 1" fill="none" opacity="0.8"/>}
        {VILLAGES.map(v => {
          const risk = v.risks[hazard]
          const r = 1 + risk / 25
          const isSel = selected?.id === v.id
          return (
            <g key={v.id} className="cursor-pointer" onClick={() => onSelect(v)}>
              {risk >= 60 && <circle cx={v.x} cy={v.y} r={r*2.4} fill="url(#glow)" className="pulse-glow"/>}
              <circle cx={v.x} cy={v.y} r={r} fill={hz.color} stroke={isSel ? '#fff' : 'rgba(255,255,255,0.7)'} strokeWidth={isSel ? 0.5 : 0.2}/>
              <text x={v.x} y={v.y - r - 0.6} textAnchor="middle" fill="white" style={{ fontSize: '1.6px', paintOrder:'stroke', stroke:'rgba(0,0,0,0.7)', strokeWidth:0.3 }}>{v.name}</text>
            </g>
          )
        })}
      </svg>
      <div className="absolute bottom-3 left-3 glass rounded-xl p-3 text-xs space-y-1.5">
        <div className="font-semibold mb-1 flex items-center gap-1.5"><Layers className="w-3 h-3"/>{t.hazards[hazard]} risk</div>
        {[['High','risk-red'],['Elevated','risk-orange'],['Moderate','risk-yellow'],['Low','risk-green']].map(([l,c]) => (
          <div key={l} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${c}`}/>{l}</div>
        ))}
      </div>
      <div className="absolute top-3 right-3 glass rounded-xl px-3 py-1.5 text-xs flex items-center gap-2"><Satellite className="w-3 h-3"/>Sentinel-2 · 2025-06-14</div>
    </div>
  )
}

function HazardToggle({ current, onChange, t }) {
  return (
    <div className="flex flex-wrap gap-2">
      {HAZARDS.map(h => {
        const Icon = h.icon
        const active = current === h.id
        return (
          <button key={h.id} onClick={() => onChange(h.id)}
            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all
              ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-105' : 'glass hover:scale-105'}`}>
            <Icon className="w-4 h-4" style={{ color: active ? 'currentColor' : h.color }}/>
            {t.hazards[h.id]}
            {active && <Sparkles className="w-3 h-3 opacity-70"/>}
          </button>
        )
      })}
    </div>
  )
}

function TopThreatCard({ hazard, t }) {
  const top = [...VILLAGES].sort((a,b) => b.risks[hazard] - a.risks[hazard])[0]
  const hz = HAZARDS.find(h => h.id === hazard); const Icon = hz.icon
  const score = top.risks[hazard]
  return (
    <Card className="card-3d overflow-hidden relative border-0" style={{ background:`linear-gradient(135deg, ${hz.color}22, transparent)` }}>
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-30 blur-2xl" style={{background:hz.color}}/>
      <CardHeader className="relative">
        <CardDescription className="uppercase tracking-widest text-xs">{t.topThreat}</CardDescription>
        <div className="flex items-center gap-3 mt-1">
          <div className="p-3 rounded-2xl" style={{ background: hz.color + '30' }}>
            <Icon className="w-6 h-6" style={{ color: hz.color }}/>
          </div>
          <div>
            <CardTitle className="text-2xl">{t.hazards[hazard]} — {top.name}</CardTitle>
            <div className="text-xs text-muted-foreground mt-0.5">{t.updated}: 8 min ago · {t.source}: IMD + Open-Meteo</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-end gap-3 mb-3">
          <div className="text-6xl font-bold neon-text">{score}</div>
          <div className="pb-2">
            <Badge className={`${riskColor(score)} text-white border-0`}>{riskLabel(score)}</Badge>
            <div className="text-xs text-muted-foreground mt-1">{t.confidence}: 78%</div>
          </div>
        </div>
        <Progress value={score} className="h-2"/>
      </CardContent>
    </Card>
  )
}

function VillageDetail({ v, hazard, t, onAskAI }) {
  if (!v) return null
  const hz = HAZARDS.find(h => h.id === hazard)
  const factorsMap = {
    fire: ['Dry vegetation index high','Wind gusts 35+ km/h','No rainfall for 21 days'],
    flood: ['River discharge > 90th percentile','Upstream rainfall 180 mm/48h','Soil saturation 85%'],
    lightning: ['CAPE 2600 J/kg','Convective clouds forming','High humidity + surface heat'],
    heatwave: ['Max temp 46°C forecast','Night min > 30°C','No cloud cover 3 days'],
    earthquake: ['M4.2 event 48 km E','Historical exposure moderate','Soil type sandy alluvium'],
  }
  const factors = factorsMap[hazard]
  const score = v.risks[hazard]
  return (
    <Card className="card-3d">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="uppercase tracking-widest text-xs">{t.riskScore} · {t.next3days}</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 mt-1"><MapPin className="w-5 h-5 text-primary"/>{v.name}</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{score}</div>
            <Badge className={`${riskColor(score)} text-white border-0 mt-1`}>{riskLabel(score)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-semibold mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/>{t.whyThis} — {t.factors}</div>
          <ul className="space-y-1.5 text-sm">
            {factors.map((f,i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:hz.color}}/>
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="glass rounded-xl p-2"><div className="text-xs text-muted-foreground">{t.confidence}</div><div className="font-bold text-lg">78%</div></div>
          <div className="glass rounded-xl p-2"><div className="text-xs text-muted-foreground">{t.updated}</div><div className="font-semibold text-sm">8 min</div></div>
          <div className="glass rounded-xl p-2"><div className="text-xs text-muted-foreground">Pop.</div><div className="font-semibold text-sm">{(v.pop/1000).toFixed(0)}k</div></div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {onAskAI && (
            <Button size="sm" onClick={onAskAI} className="gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0">
              <Wand2 className="w-3 h-3"/>Explain with AI
            </Button>
          )}
          <a href="https://mausam.imd.gov.in/nagpur/" target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-1.5"><ExternalLink className="w-3 h-3"/>IMD Nagpur</Button></a>
          <a href="https://ndma.gov.in/" target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-1.5"><ExternalLink className="w-3 h-3"/>NDMA</Button></a>
        </div>
      </CardContent>
    </Card>
  )
}

function AlertsList({ lang }) {
  return (
    <div className="space-y-3">
      {ALERTS_SEED.map(a => {
        const hz = HAZARDS.find(h => h.id === a.hazard); const Icon = hz.icon
        return (
          <Card key={a.id} className={`border-l-4 card-3d ${sevBg[a.sev]}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-3 rounded-xl" style={{background:hz.color+'25'}}><Icon className="w-5 h-5" style={{color:hz.color}}/></div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant="outline" className="uppercase text-[10px]">{a.sev}</Badge>
                  <span className="font-semibold">{a.village}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/>{a.when}</span>
                  <span className="text-xs text-muted-foreground">· {a.source}</span>
                </div>
                <p className="text-sm text-foreground/90">{a[lang]}</p>
                {lang !== 'mr' && <p className="text-xs text-muted-foreground mt-1">{a.mr}</p>}
                {lang !== 'hi' && <p className="text-xs text-muted-foreground">{a.hi}</p>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function RescuePlanner({ t }) {
  const cutoff = [...VILLAGES]
    .filter(v => v.risks.flood >= 55)
    .map(v => ({ ...v, priority: Math.round((v.pop/1000) * v.vuln * (100 - v.risks.flood + 40) / 10) }))
    .sort((a,b) => b.priority - a.priority)
  const handlePrint = () => window.print()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold">{t.cutoffRisk}</h3>
          <p className="text-sm text-muted-foreground">Priority = Population × Vulnerability × (time to cut-off)</p>
        </div>
        <Button onClick={handlePrint} className="gap-2"><Printer className="w-4 h-4"/>{t.printBriefing}</Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {cutoff.map((v,i) => (
            <Card key={v.id} className="card-3d">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">{i+1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-lg">{v.name}</span>
                    <Badge className="risk-red text-white border-0">Flood {v.risks.flood}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{(v.pop/1000).toFixed(0)}k {t.population.toLowerCase()}</span>
                    <span>{t.vulnerability}: {(v.vuln*100).toFixed(0)}%</span>
                    <span>ETA cut-off: {12 + i*4}h</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{v.priority}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Priority</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="card-3d">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hospital className="w-4 h-4"/>Shelters &amp; Hospitals</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {SHELTERS.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                {s.type === 'hospital' ? <Hospital className="w-4 h-4 text-red-500"/> : s.type === 'school' ? <School className="w-4 h-4 text-blue-500"/> : <HomeIcon className="w-4 h-4 text-green-500"/>}
                <div className="flex-1"><div className="font-medium">{s.name}</div><div className="text-xs text-muted-foreground">Capacity: {s.cap}</div></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DataMethods() {
  return (
    <div className="space-y-4">
      {DATA_SOURCES.map(s => (
        <Card key={s.name} className="card-3d">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-primary"/>
                  <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline flex items-center gap-1">{s.name}<ExternalLink className="w-3 h-3"/></a>
                </div>
                <p className="text-xs text-muted-foreground mb-2"><span className="font-medium">Known limitations:</span> {s.limit}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">Hazard: {s.hazard}</Badge>
                  <Badge variant="outline">Refresh: {s.freq}</Badge>
                  <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3"/>{s.updated}</Badge>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-1"/>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card className="border-yellow-500/40 bg-yellow-500/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5"/>
          <div className="text-sm">
            <div className="font-semibold text-yellow-700 dark:text-yellow-400">Model status</div>
            <p className="text-muted-foreground">The <code>hazard_scores</code> table is currently populated by seed data. External Python model not yet connected. Displayed scores are illustrative only.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState('en')
  const [dark, setDark] = useState(true)
  const [hazard, setHazard] = useState('flood')
  const [tab, setTab] = useState('home')
  const [selected, setSelected] = useState(VILLAGES[6])
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const t = I18N[lang]

  return (
    <div className="min-h-screen mesh-bg relative">
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/50"/>
              <div className="absolute inset-0 rounded-xl grid place-items-center"><ShieldAlert className="w-5 h-5 text-white"/></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 pulse-glow"/>
            </div>
            <div>
              <div className="font-bold text-lg leading-none">{t.brand}</div>
              <div className="text-[10px] text-muted-foreground">{t.tagline}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 glass rounded-xl p-1">
              {['en','hi','mr'].map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 text-xs rounded-lg font-medium transition ${lang===l?'bg-primary text-primary-foreground':'hover:bg-accent'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>{dark ? <SunMedium className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}</Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="glass rounded-2xl p-3 flex items-center gap-3 border border-yellow-500/30">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0"/>
          <p className="text-xs md:text-sm text-muted-foreground">{t.disclaimer}</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="glass grid grid-cols-2 md:grid-cols-5 h-auto p-1.5 rounded-2xl gap-1">
            <TabsTrigger value="home"    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">{t.nav.home}</TabsTrigger>
            <TabsTrigger value="village" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">{t.nav.village}</TabsTrigger>
            <TabsTrigger value="alerts"  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">{t.nav.alerts}</TabsTrigger>
            <TabsTrigger value="rescue"  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">{t.nav.rescue}</TabsTrigger>
            <TabsTrigger value="data"    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">{t.nav.data}</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 mt-6">
            <CycloneHero/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: MapPin,   label: t.villagesCovered, value: '11',    sub: 'Vidarbha districts' },
                { icon: Layers,   label: t.hazardsTracked,  value: '5',     sub: 'Fire · Flood · Storm' },
                { icon: Radio,    label: t.liveNow,         value: '12',    sub: 'active alerts' },
                { icon: Activity, label: t.modelStatus,     value: 'Seed',  sub: 'model not yet connected' },
              ].map((s,i) => {
                const Icon = s.icon
                return (
                  <Card key={i} className="card-3d relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"/>
                    <CardContent className="p-4 relative">
                      <Icon className="w-5 h-5 text-primary mb-2"/>
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs font-medium">{s.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <HazardToggle current={hazard} onChange={setHazard} t={t}/>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3"/>{t.updated} 8 min ago</div>
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2"><VidarbhaMap hazard={hazard} onSelect={setSelected} selected={selected} t={t}/></div>
              <div className="space-y-4">
                <TopThreatCard hazard={hazard} t={t}/>
                <Card className="card-3d bg-gradient-to-br from-primary/10 to-transparent">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Send className="w-5 h-5 text-primary"/>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{t.subscribe}</div>
                      <div className="text-xs text-muted-foreground">Get village-level alerts on Telegram</div>
                    </div>
                    <a href="https://t.me/" target="_blank" rel="noreferrer"><Button size="sm">Join</Button></a>
                  </CardContent>
                </Card>
              </div>
            </div>
            {selected && (
              <div className="grid lg:grid-cols-2 gap-5">
                <VillageDetail v={selected} hazard={hazard} t={t} onAskAI={() => setAiOpen(true)}/>
                <Card className="card-3d">
                  <CardHeader><CardTitle className="text-base">All hazards for {selected.name}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {HAZARDS.map(h => {
                      const Icon = h.icon
                      const r = selected.risks[h.id]
                      return (
                        <div key={h.id} className="flex items-center gap-3">
                          <Icon className="w-4 h-4" style={{color:h.color}}/>
                          <div className="w-24 text-sm">{t.hazards[h.id]}</div>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full ${riskColor(r)}`} style={{width:`${r}%`}}/>
                          </div>
                          <div className="w-10 text-right text-sm font-semibold">{r}</div>
                        </div>
                      )
                    })}
                    <p className="text-[11px] text-muted-foreground italic pt-2 border-t">{t.quakeNote}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="village" className="space-y-4 mt-6">
            <Card className="card-3d">
              <CardContent className="p-4 flex flex-wrap gap-2">
                {VILLAGES.map(v => (
                  <button key={v.id} onClick={() => setSelected(v)} className={`px-3 py-1.5 rounded-xl text-sm transition ${selected?.id===v.id ? 'bg-primary text-primary-foreground' : 'glass hover:scale-105'}`}>
                    {lang==='hi' ? v.hi : lang==='mr' ? v.mr : v.name}
                  </button>
                ))}
              </CardContent>
            </Card>
            <div className="grid lg:grid-cols-2 gap-5">
              <VillageDetail v={selected} hazard={hazard} t={t} onAskAI={() => setAiOpen(true)}/>
              <Card className="card-3d">
                <CardHeader><CardTitle className="text-base">All hazards — {selected?.name}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {HAZARDS.map(h => {
                    const Icon = h.icon
                    const r = selected?.risks[h.id] || 0
                    return (
                      <div key={h.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2"><Icon className="w-4 h-4" style={{color:h.color}}/>{t.hazards[h.id]}</span>
                          <span className="font-semibold">{r} · <span className="text-xs text-muted-foreground">78% conf.</span></span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${riskColor(r)} transition-all`} style={{width:`${r}%`}}/>
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-[11px] text-muted-foreground italic pt-2 border-t">{t.quakeNote}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold">{t.activeAlerts}</h3>
                <p className="text-sm text-muted-foreground">Advisory only. Follow official channels for evacuation orders.</p>
              </div>
              <a href="https://t.me/" target="_blank" rel="noreferrer"><Button className="gap-2"><Send className="w-4 h-4"/>{t.subscribe}</Button></a>
            </div>
            <AlertsList lang={lang}/>
          </TabsContent>

          <TabsContent value="rescue" className="mt-6"><RescuePlanner t={t}/></TabsContent>
          <TabsContent value="data" className="mt-6"><DataMethods/></TabsContent>
        </Tabs>

        <footer className="text-center text-xs text-muted-foreground py-8 border-t mt-8">
          KhetAlert — open-source, community-driven early warning · Not an official emergency service. Always defer to IMD &amp; NDMA.
        </footer>
      </main>

      {/* Floating AI button */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all"
        aria-label="Open AI Assistant"
      >
        <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/15">
          <Bot className="w-4 h-4"/>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 pulse-glow"/>
        </span>
        <span className="font-semibold text-sm hidden sm:inline">
          {lang==='mr' ? 'AI ला विचारा' : lang==='hi' ? 'AI से पूछें' : 'Ask AI'}
        </span>
        <Sparkles className="w-3.5 h-3.5 opacity-80"/>
      </button>

      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} lang={lang} village={selected} hazard={hazard} t={t}/>
    </div>
  )
}

export default App
