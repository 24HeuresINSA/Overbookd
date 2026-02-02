import { Module } from "@nestjs/common";
import { AppModule } from "../src/app.module";

@Module({
  imports: [AppModule],
})
export class AppTestModule {}
