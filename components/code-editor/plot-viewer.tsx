'use client'

import { ZoomIn, Download } from 'lucide-react'
import { useState } from 'react'

export function PlotViewer({ src }: { src: string }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <div className="relative rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Plot output"
          className="w-full h-auto"
        />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setZoomed(true)}
            className="p-1.5 rounded-md bg-gray-900/70 text-white hover:bg-gray-900/90 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <a
            href={src}
            download="plot.png"
            className="p-1.5 rounded-md bg-gray-900/70 text-white hover:bg-gray-900/90 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Zoom overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Plot output (zoomed)"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  )
}
