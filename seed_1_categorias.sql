-- =============================================
-- ZaiWear — Seed Completo: Categorias + Produtos
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Limpar dados anteriores
DELETE FROM public.categories;

-- 2. Inserir categorias
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('62d9103a-1f8d-464e-bdcc-48052e716eae', 'Bermudas', 'bermudas', 'Bermudas masculinas plus size em brim, jeans, moletinho e nylon.'),
  ('18b655a2-18e9-4e7c-ac87-983b8c1eabb1', 'Calças Jeans', 'calcas-jeans', 'Calcas jeans masculinas plus size com modelagem confortavel.'),
  ('f81fe0be-8af1-4c2e-8395-8f31bf3010a5', 'Camisetas Básicas 100% Algodão', 'camisetas-basicas-100-algodao', 'Camisetas masculinas plus size 100% algodao. Conforto e estilo.'),
  ('91a1ee00-8a6c-468a-a806-f746c4077c7e', 'Camisetas Premium Pima', 'camisetas-premium-pima', 'Camisetas masculinas plus size em algodao pima premium.'),
  ('2a501644-403e-408d-92d8-f5747612cf2a', 'Acessórios', 'acessorios', 'Acessorios masculinos: cintos em couro e lona.'),
  ('1d33cba9-9025-4ac3-8a0c-b16519007c22', 'Cuecas', 'cuecas', 'Cuecas masculinas plus size. Marcas DM e Taurus, varios modelos.'),
  ('ca4176dd-af60-4ffa-a433-43b9bc6e5c0d', 'Gola Polo', 'gola-polo', 'Camisas polo masculinas plus size em diversas cores.');