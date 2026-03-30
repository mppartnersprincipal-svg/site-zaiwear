import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/components/admin/AdminLayout'

import Index from '@/pages/Index'
import CategoryPage from '@/pages/CategoryPage'
import AllCategoriesPage from '@/pages/AllCategoriesPage'
import NotFound from '@/pages/NotFound'
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminProductForm from '@/pages/admin/AdminProductForm'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminCategoryForm from '@/pages/admin/AdminCategoryForm'
import AdminFeatured from '@/pages/admin/AdminFeatured'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/categorias" element={<AllCategoriesPage />} />
                <Route path="/categoria/:slug" element={<CategoryPage />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/produtos" element={<AdminProducts />} />
                <Route path="/admin/produtos/novo" element={<AdminProductForm />} />
                <Route path="/admin/produtos/:id" element={<AdminProductForm />} />
                <Route path="/admin/categorias" element={<AdminCategories />} />
                <Route path="/admin/categorias/nova" element={<AdminCategoryForm />} />
                <Route path="/admin/categorias/:id" element={<AdminCategoryForm />} />
                <Route path="/admin/destaques" element={<AdminFeatured />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
