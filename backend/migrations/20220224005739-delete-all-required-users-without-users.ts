import { Db } from "mongodb";
export = {
  async up(db: Db): Promise<void> {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    /**
     * This migration script remove required
     */
    const ops = await db.collection("fts").updateMany(
      {},
      {
        //@ts-ignore
        $pull: {
          timeframes: {
            required: {
              $elemMatch: {
                $and: [
                  //@ts-ignore
                  { type: "user" },
                  //@ts-ignore
                  { "user._id": { $exists: false } },
                ],
              },
            },
          },
        },
      }
    );
    console.log(ops);
  },

  async down(): Promise<void> {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
