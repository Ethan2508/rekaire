-- ============================================
-- REKAIRE - Correction Prix Produit
-- Synchroniser la BDD avec les constantes du code
-- ============================================

-- 1. Vérifier les prix actuels
SELECT slug, price_ht, discount_percent, stock 
FROM products 
WHERE slug = 'rk01';

-- 2. Corriger le prix HT (70€ HT = 7000 centimes)
UPDATE products 
SET 
  price_ht = 7000,  -- 70€ HT en centimes
  updated_at = NOW()
WHERE slug = 'rk01';

-- 3. Vérifier la correction
SELECT 
  slug, 
  price_ht as "Prix HT (centimes)",
  price_ht / 100.0 as "Prix HT (€)",
  ROUND(price_ht * 1.20) as "Prix TTC (centimes)",
  ROUND(price_ht * 1.20) / 100.0 as "Prix TTC (€)"
FROM products 
WHERE slug = 'rk01';

-- Résultat attendu:
-- slug  | Prix HT (centimes) | Prix HT (€) | Prix TTC (centimes) | Prix TTC (€)
-- rk01  | 7000              | 70.00       | 8400               | 84.00

COMMENT ON COLUMN products.price_ht IS 'Prix unitaire HT en centimes (ex: 7000 = 70€ HT)';
