import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface Props {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
}

export function ImageUpload({ value, onChange, folder = 'products' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem maior que 5MB.')
      return
    }

    setError('')
    setUploading(true)

    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      setError('Erro ao fazer upload: ' + uploadErr.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
    onChange(data.publicUrl)
    setUploading(false)
  }

  async function handleRemove() {
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden aspect-square bg-muted">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-foreground"
            >
              <Upload size={12} />
              Trocar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-destructive"
            >
              <X size={12} />
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-3 aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload size={24} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center px-4">
                Clique para fazer upload<br />PNG, JPG, WebP — max 5MB
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
