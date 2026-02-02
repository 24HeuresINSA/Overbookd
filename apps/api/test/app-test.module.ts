import { Module } from "@nestjs/common";
import { AppController } from "../src/app.controller";
import { AppService } from "../src/app.service";

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppTestModule {}
