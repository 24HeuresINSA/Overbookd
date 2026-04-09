import { Module } from "@nestjs/common";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";
import { PrismaInquiries } from "../../common/repository/inquiries.prisma";
import { InquirySectionService } from "./inquiry-section.service";

@Module({
  providers: [
    {
      provide: InquirySectionService,
      useFactory: (
        inquiries: PrismaInquiries,
        prepare: PrepareFestivalActivity,
      ) => new InquirySectionService(inquiries, prepare),
      inject: [PrismaInquiries, PrepareFestivalActivity],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [InquirySectionService],
})
export class InquirySectionModule {}
