import { Module } from "@nestjs/common";
import { InquirySectionService } from "./inquiry-section.service";
import { PrismaInquiries } from "../../common/repository/inquiries.prisma";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";

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
