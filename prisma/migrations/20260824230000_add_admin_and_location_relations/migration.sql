ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Profile" ADD COLUMN "city_id" INTEGER;
ALTER TABLE "Gym" ADD COLUMN "city_id" INTEGER;
ALTER TABLE "Gym" ADD COLUMN "image_url" TEXT;

UPDATE "Profile" AS profile
SET "city_id" = (
  SELECT city.codigo_ibge
  FROM "City" AS city
  WHERE lower(city.nome) = lower(profile.city)
     OR (city.nome = 'Mossoró' AND lower(profile.city) = 'mossoro')
  ORDER BY city.codigo_ibge
  LIMIT 1
)
WHERE profile.city IS NOT NULL;

UPDATE "Gym" AS gym
SET "city_id" = city.codigo_ibge
FROM "City" AS city
JOIN "State" AS state ON state.codigo_uf = city.codigo_uf
WHERE (lower(city.nome) = lower(gym.city)
    OR (city.nome = 'Mossoró' AND lower(gym.city) = 'mossoro'))
  AND upper(state.uf) = upper(gym.state);

ALTER TABLE "Profile" DROP COLUMN "city";
ALTER TABLE "Gym" DROP COLUMN "city";
ALTER TABLE "Gym" DROP COLUMN "state";

ALTER TABLE "Gym" ALTER COLUMN "city_id" SET NOT NULL;

CREATE INDEX "Profile_city_id_idx" ON "Profile"("city_id");
CREATE INDEX "Gym_city_id_idx" ON "Gym"("city_id");
CREATE INDEX "City_codigo_uf_idx" ON "City"(codigo_uf);

ALTER TABLE "Profile"
  ADD CONSTRAINT "Profile_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "City"(codigo_ibge)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Gym"
  ADD CONSTRAINT "Gym_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "City"(codigo_ibge)
  ON DELETE RESTRICT ON UPDATE CASCADE;
