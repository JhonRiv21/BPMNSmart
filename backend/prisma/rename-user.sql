-- 1) Agregar columna lastNames (nullable)
ALTER TABLE "User"
  ADD COLUMN "lastNames" TEXT;

-- 2) Copiar valores actuales de lastName a lastNames
UPDATE "User"
  SET "lastNames" = "lastName";

-- 3) Eliminar columnas antiguas lastName y password
ALTER TABLE "User"
  DROP COLUMN "lastName",
  DROP COLUMN "password";

-- 4) Marcar lastNames como NOT NULL
ALTER TABLE "User"
  ALTER COLUMN "lastNames" SET NOT NULL;
