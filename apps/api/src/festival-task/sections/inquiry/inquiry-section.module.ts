import { Module } from "@nestjs/common";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { InquirySectionService } from "./inquiry-section.service";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { PrismaInquiries } from "../../common/repository/inquiry/inquiries.prisma";

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
