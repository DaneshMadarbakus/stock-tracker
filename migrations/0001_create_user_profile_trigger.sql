-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION public.sync_new_user()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.user_profiles(user_id)
  VALUES (NEW.id) 
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER create_profile_row
AFTER INSERT ON neon_auth.users_sync
FOR EACH ROW
EXECUTE FUNCTION public.sync_new_user();
