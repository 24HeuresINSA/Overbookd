import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";

@Module({
    controllers: [FriendController],
    providers: [FriendService, PrismaService],
  })
  export class FriendModule {}