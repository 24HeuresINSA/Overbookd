import app from "@server";
import logger from "@shared/Logger";
import { connect } from "mongoose";

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, async () => {
  await connect(process.env.DATABASE_URL || "mongodb://localhost:27017/", {
    dbName: "local",
  });
  logger.info("Express server started on port: " + port);
});
