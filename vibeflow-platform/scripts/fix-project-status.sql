-- Script SQL pour corriger le statut du projet bloqué en "GENERATING"
-- À exécuter dans Supabase SQL Editor

-- 1. Voir tous les projets en génération
SELECT id, name, status, "createdAt" 
FROM projects 
WHERE status = 'GENERATING';

-- 2. Mettre à jour le statut vers ACTIVE (remplacez l'ID par celui de votre projet)
UPDATE projects 
SET status = 'ACTIVE' 
WHERE id = 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4';

-- 3. Vérifier que c'est bien mis à jour
SELECT id, name, status 
FROM projects 
WHERE id = 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4';

