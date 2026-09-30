'use client'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-muted" />,
})

export default MapView
