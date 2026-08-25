-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_codigo_uf_fkey";

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_codigo_uf_fkey" FOREIGN KEY ("codigo_uf") REFERENCES "State"("codigo_uf") ON DELETE NO ACTION ON UPDATE NO ACTION;
