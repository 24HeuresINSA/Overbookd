import { Module } from "@nestjs/common";
import { StaffMembershipApplicationModule } from "./staff/staff-membership-application.module";
import { VolunteerMembershipApplicationModule } from "./volunteer/volunteer-membership-application.module";

@Module({
  imports: [
    StaffMembershipApplicationModule,
    VolunteerMembershipApplicationModule,
  ],
})
export class MembershipApplicationModule {}
