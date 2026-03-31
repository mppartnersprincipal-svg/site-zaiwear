import { X } from 'lucide-react'
import type { SizeChart } from '@/data/sizeCharts'

interface Props {
  chart: SizeChart
  onClose: () => void
}

export function SizeChartModal({ chart, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <h2 className="font-headline text-sm font-bold text-[#00113a] text-center flex-1 leading-snug pr-4">
            {chart.title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-7 h-7 border border-[#00113a]/30 text-[#00113a] hover:bg-[#00113a]/10 transition-colors"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="px-4 pb-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#00113a]/15">
                {chart.headers.map((header, i) => (
                  <th
                    key={i}
                    className="py-2.5 px-2 font-headline text-xs font-bold text-[#00113a] text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[#00113a]/8 hover:bg-[#f5f7ff]"
                >
                  <td className="py-2.5 px-2 font-headline text-xs font-bold text-[#1d4ed8]">
                    {row.size}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className="py-2.5 px-2 font-body text-xs text-[#00113a]/80"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="px-6 py-4 font-body text-[10px] text-[#444650]/60 text-center">
          {chart.note}
        </p>
      </div>
    </div>
  )
}
