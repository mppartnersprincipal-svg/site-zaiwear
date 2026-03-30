import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-display text-8xl font-bold" style={{ color: 'var(--color-primary)' }}>404</h1>
      <h2 className="font-display text-2xl font-semibold text-foreground mt-4">Página não encontrada</h2>
      <p className="text-muted-foreground text-sm mt-2 mb-8">A página que você está procurando não existe ou foi movida.</p>
      <Link
        to="/"
        className="btn-primary"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Voltar para o Início
      </Link>
    </div>
  )
}
