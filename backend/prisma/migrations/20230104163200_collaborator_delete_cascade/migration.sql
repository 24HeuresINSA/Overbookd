-- DropForeignKey
ALTER TABLE "fa_collaborators" DROP CONSTRAINT "fa_collaborators_collaborator_id_fkey";

-- AddForeignKey
ALTER TABLE "fa_collaborators" ADD CONSTRAINT "fa_collaborators_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
