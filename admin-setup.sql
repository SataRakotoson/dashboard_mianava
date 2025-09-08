-- Script pour créer un utilisateur administrateur
-- À exécuter après l'inscription dans Supabase Auth

-- Remplacez 'your-user-id' par l'ID de l'utilisateur créé dans Supabase Auth
-- Remplacez 'admin@mianava.com' par l'email de l'administrateur

UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@mianava.com';

-- Vérifier que l'utilisateur a bien le rôle admin
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE email = 'admin@mianava.com';

-- Optionnel : Créer quelques logs d'activité de test
SELECT log_activity(
  (SELECT id FROM users WHERE email = 'admin@mianava.com'),
  'Système initialisé',
  'system',
  NULL,
  '{"message": "Dashboard Mianava initialisé avec succès"}'::jsonb
);
