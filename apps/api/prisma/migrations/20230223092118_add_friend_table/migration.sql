-- CreateTable
CREATE TABLE "Friend" (
    "requestor_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("requestor_id","friend_id")
);

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_requestor_id_fkey" FOREIGN KEY ("requestor_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
