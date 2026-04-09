import { Module } from "@nestjs/common";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { PrismaInquiries } from "../../common/repository/inquiries.prisma";
import { InquirySectionService } from "./inquiry-section.service";

@Module({
  providers: [
    {
      provide: InquirySectionService,
      useFactory: (prepare: PrepareFestivalTask, inquiries: PrismaInquiries) =>
        new InquirySectionService(prepare, inquiries),
      inject: [PrepareFestivalTask, PrismaInquiries],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [InquirySectionService],
})
export class InquirySectionModule {}
