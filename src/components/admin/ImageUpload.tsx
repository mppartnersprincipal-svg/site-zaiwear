import { useRef, useState } from 'react'
import { Upload, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface Props {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
}

const UPLOAD_TIMEOUT_MS = 60000

const ERROR_MESSAGES: Record<string, string> = {
  'The resource was not found': 'Bucket "product-images" não encontrado. Crie-o no painel do Supabase (Storage > Buckets).',
  'new row violates row-level security policy': 'Sem permissão para upload. Verifique as políticas de storage no Supabase.',
  'Unauthorized': 'Sessão expirada. Faça login novamente.',
  'Invalid JWT': 'Sessão inválida. Faça login novamente.',
  'exceeded the maximum allowed size': 'Arquivo muito grande. Máximo permitido: 5MB.',
  'duplicate': 'Já existe um arquivo com esse nome. Tente novamente.',
}

function friendlyError(message: string): string {
  for (const [key, friendly] of Object.entries(ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return friendly
  }
  return `Erro ao fazer upload: ${message}`
}

export function ImageUpload({ value, onChange, folder = 'products' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [lastFile, setLastFile] = useState<File | null>(null)

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
    setLastFile(file)

    const { data: { session } } = await supabase.auth.getSession()
    console.log('[ImageUpload] session uid:', session?.user?.id ?? 'NULL - não autenticado')
    console.log('[ImageUpload] token expires:', session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A')

    if (!session) {
      setError('Sessão expirada. Faça login novamente.')
      setUploading(false)
      return
    }

    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    try {
      const uploadPromise = supabase.storage
        .from('product-images')
        .upload(filename, file, { cacheControl: '3600', upsert: false })

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), UPLOAD_TIMEOUT_MS)
      )

      const { error: uploadErr } = await Promise.race([uploadPromise, timeoutPromise])

      if (uploadErr) {
        console.error('[ImageUpload] Supabase error:', uploadErr)
        setError(friendlyError(uploadErr.message))
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
      onChange(data.publicUrl)
      setLastFile(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[ImageUpload] catch error:', message)
      if (message === 'timeout') {
        setError('Upload demorou demais. Verifique sua conexão e tente novamente.')
      } else {
        setError(friendlyError(message))
      }
    } finally {
      setUploading(false)
    }
  }

  function handleRetry() {
    if (lastFile) handleFile(lastFile)
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
          className="flex flex-col items-center justify-center gap-3 aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Enviando...</span>
            </>
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

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-destructive" />
          <p className="flex-1 text-xs text-destructive">{error}</p>
          {lastFile && (
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs font-medium text-destructive underline-offset-2 hover:underline shrink-0"
            >
              <RefreshCw size={11} />
              Tentar novamente
            </button>
          )}
        </div>
      )}

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
