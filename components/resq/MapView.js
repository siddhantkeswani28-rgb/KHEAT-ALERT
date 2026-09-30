'use client'
import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { REPORT_TYPES, ZONE_CATEGORIES } from '@/lib/resq'

const TILES = {
  street: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap contributors', className: 'tiles-street', maxZoom: 19 },
  terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenTopoMap (CC-BY-SA)', maxZoom: 17 },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Tiles &copy; Esri', maxZoom: 19 },
}
const RAIN_COLORS = ['#38bdf8', '#0ea5e9', '#f59e0b', '#f97316', '#dc2626']
const WIND_COLORS = ['#94a3b8', '#a3e635', '#f59e0b', '#f97316', '#ef4444']
const SEV5 = ['#64748b', '#84cc16', '#f59e0b', '#f97316', '#ef4444', '#b91c1c']

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export default function MapView({
  center = [19.076, 72.877], zoom = 11, baseLayer = 'street', mode = 'view',
  weatherPoints = [], reports = [], sos = [], zones = [], drawPoints = [], route = null, routeFrom = null, routeTo = null, pin = null, home = null,
  showWeather = true, showReports = true, showSos = true, showZones = true,
  onMapClick, onSelect, onMoveEnd, flyTo, className = '',
}) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const tileRef = useRef(null)
  const groups = useRef({})
  const cb = useRef({})
  cb.current = { onMapClick, onSelect, onMoveEnd, mode }

  // init
  useEffect(() => {
    if (mapRef.current || !elRef.current) return
    const map = L.map(elRef.current, { center, zoom, zoomControl: true, attributionControl: true, preferCanvas: false })
    mapRef.current = map
    for (const k of ['weather', 'zones', 'route', 'reports', 'sos', 'draw', 'pin', 'home']) groups.current[k] = L.layerGroup().addTo(map)
    map.on('click', (e) => cb.current.onMapClick?.([e.latlng.lat, e.latlng.lng]))
    map.on('moveend', () => { const c = map.getCenter(); cb.current.onMoveEnd?.({ lat: c.lat, lon: c.lng, zoom: map.getZoom() }) })
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(elRef.current)
    setTimeout(() => map.invalidateSize(), 50)
    return () => { ro.disconnect(); map.remove(); mapRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // base layer
  useEffect(() => {
    const map = mapRef.current; if (!map) return
    if (tileRef.current) map.removeLayer(tileRef.current)
    const t = TILES[baseLayer] || TILES.street
    tileRef.current = L.tileLayer(t.url, { attribution: t.attribution, maxZoom: t.maxZoom, className: t.className || '' }).addTo(map)
    tileRef.current.bringToBack()
  }, [baseLayer])

  // cursor
  useEffect(() => { if (elRef.current) elRef.current.style.cursor = mode === 'view' ? '' : 'crosshair' }, [mode])

  // fly
  useEffect(() => { if (flyTo && mapRef.current) mapRef.current.flyTo([flyTo.lat, flyTo.lon], flyTo.zoom || mapRef.current.getZoom(), { duration: 0.8 }) }, [flyTo])

  // weather overlay
  useEffect(() => {
    const g = groups.current.weather; if (!g) return
    g.clearLayers()
    if (!showWeather) return
    for (const p of weatherPoints) {
      const rainLvl = p.rainLevel || 0
      const intensity = Math.max(p.precip || 0, (p.precipNext6h || 0) / 3)
      if (intensity > 0.15) {
        L.circle([p.lat, p.lon], { radius: 2200 + rainLvl * 1400 + Math.min(intensity, 30) * 60, color: RAIN_COLORS[rainLvl], weight: 1, fillColor: RAIN_COLORS[rainLvl], fillOpacity: 0.18 + rainLvl * 0.08 })
          .bindTooltip(`<b>${esc(p.desc)}</b><br/>Rain now ${p.precip ?? 0} mm/h · next 6h ${p.precipNext6h ?? 0} mm`, { sticky: true }).addTo(g)
      }
      const wl = p.windLevel || 0
      const gust = Math.round(p.gust || 0)
      const size = 26 + wl * 6
      const html = `<div class="wind-arrow" style="width:${size}px;height:${size}px;transform:rotate(${(p.dir || 0) + 180}deg);color:${WIND_COLORS[wl]}">` +
        `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor"><path d="M12 2 L19 20 L12 16 L5 20 Z"/></svg></div><div class="wind-label" style="color:${WIND_COLORS[wl]}">${gust}</div>`
      L.marker([p.lat, p.lon], { icon: L.divIcon({ className: 'wind-icon', html, iconSize: [size, size + 12], iconAnchor: [size / 2, size / 2] }), interactive: true, keyboard: false })
        .bindTooltip(`Wind ${Math.round(p.wind || 0)} km/h · gusts ${gust} km/h · from ${Math.round(p.dir || 0)}°`, { sticky: true }).addTo(g)
    }
  }, [weatherPoints, showWeather])

  // zones
  useEffect(() => {
    const g = groups.current.zones; if (!g) return
    g.clearLayers()
    if (!showZones) return
    for (const z of zones) {
      const c = ZONE_CATEGORIES[z.category]?.color || '#64748b'
      L.polygon(z.points, { color: c, weight: 2, dashArray: '6 4', fillColor: c, fillOpacity: 0.22 })
        .bindTooltip(`<b>${esc(z.name)}</b><br/>${esc(ZONE_CATEGORIES[z.category]?.label || z.category)}${z.notes ? '<br/>' + esc(z.notes) : ''}`, { sticky: true })
        .on('click', () => cb.current.onSelect?.({ ...z, kind: 'zone' })).addTo(g)
    }
  }, [zones, showZones])

  // reports
  useEffect(() => {
    const g = groups.current.reports; if (!g) return
    g.clearLayers()
    if (!showReports) return
    for (const r of reports) {
      const meta = REPORT_TYPES[r.type] || REPORT_TYPES.other
      const sev = SEV5[r.severity || 3]
      const html = `<div class="gt-marker ${r.corroborated ? 'gt-hot' : ''}" style="--c:${sev};border-color:${meta.color}"><span>${meta.icon}</span></div>`
      L.marker([r.lat, r.lon], { icon: L.divIcon({ className: 'gt-icon', html, iconSize: [34, 34], iconAnchor: [17, 17] }) })
        .bindTooltip(`<b>${esc(meta.label)}</b> · sev ${r.severity}/5${r.corroborated ? ' · <span style="color:#f97316">corroborated by feeds</span>' : ''}<br/>${esc(r.description || '')}`, { sticky: true })
        .on('click', () => cb.current.onSelect?.(r)).addTo(g)
    }
  }, [reports, showReports])

  // sos
  useEffect(() => {
    const g = groups.current.sos; if (!g) return
    g.clearLayers()
    if (!showSos) return
    for (const s of sos) {
      const html = `<div class="sos-marker ${s.status === 'new' ? 'sos-live' : ''}">SOS<small>${s.people || 1}</small></div>`
      L.marker([s.lat, s.lon], { icon: L.divIcon({ className: 'sos-icon', html, iconSize: [44, 44], iconAnchor: [22, 22] }), zIndexOffset: 1000 })
        .bindTooltip(`<b>DISTRESS</b> · ${s.people} people · sev ${s.severity}/5 · ${esc(s.status)}<br/>${esc(s.message || '')}`, { sticky: true })
        .on('click', () => cb.current.onSelect?.(s)).addTo(g)
    }
  }, [sos, showSos])

  // draw in-progress polygon
  useEffect(() => {
    const g = groups.current.draw; if (!g) return
    g.clearLayers()
    if (!drawPoints.length) return
    drawPoints.forEach((p, i) => L.circleMarker(p, { radius: 5, color: '#fff', weight: 2, fillColor: '#f59e0b', fillOpacity: 1 }).bindTooltip(`${i + 1}`).addTo(g))
    if (drawPoints.length >= 2) L.polyline(drawPoints, { color: '#f59e0b', weight: 2 }).addTo(g)
    if (drawPoints.length >= 3) L.polygon(drawPoints, { color: '#f59e0b', weight: 1, dashArray: '4 4', fillOpacity: 0.15 }).addTo(g)
  }, [drawPoints])

  // route
  useEffect(() => {
    const g = groups.current.route; if (!g) return
    g.clearLayers()
    const mk = (pos, label, color) => L.marker(pos, { icon: L.divIcon({ className: 'route-pt', html: `<div class="route-badge" style="background:${color}">${label}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] }) }).addTo(g)
    if (routeFrom) mk(routeFrom, 'A', '#2563eb')
    if (routeTo) mk(routeTo, 'B', '#dc2626')
    if (route?.coordinates?.length) {
      L.polyline(route.coordinates, { color: '#052e16', weight: 9, opacity: 0.55 }).addTo(g)
      L.polyline(route.coordinates, { color: route.residual ? '#f97316' : '#22c55e', weight: 5, opacity: 0.95 }).addTo(g)
      if (route.via) mk(route.via, '\u21BB', '#7c3aed')
      try { mapRef.current?.fitBounds(L.latLngBounds(route.coordinates), { padding: [40, 40] }) } catch {}
    }
  }, [route, routeFrom, routeTo])

  // pin / home
  useEffect(() => {
    const g = groups.current.pin; if (!g) return
    g.clearLayers()
    if (pin) L.marker(pin, { icon: L.divIcon({ className: 'pin-icon', html: '<div class="pin-drop"></div>', iconSize: [24, 34], iconAnchor: [12, 34] }) }).addTo(g)
  }, [pin])
  useEffect(() => {
    const g = groups.current.home; if (!g) return
    g.clearLayers()
    if (home) L.circleMarker(home, { radius: 7, color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }).bindTooltip('You are here').addTo(g)
  }, [home])

  return <div ref={elRef} className={`map-shell h-full w-full ${className}`} />
}
