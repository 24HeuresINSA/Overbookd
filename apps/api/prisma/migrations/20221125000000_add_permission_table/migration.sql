-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team_Permission" (
    "team_code" TEXT NOT NULL,
    "permission_name" TEXT NOT NULL,

    CONSTRAINT "Team_Permission_pkey" PRIMARY KEY ("team_code", "permission_name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- AddForeignKey
ALTER TABLE "Team_Permission" ADD CONSTRAINT "Team_Permission_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "Team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Permission" ADD CONSTRAINT "Team_Permission_permission_name_fkey" FOREIGN KEY ("permission_name") REFERENCES "Permission"("name") ON DELETE CASCADE ON UPDATE CASCADE;
