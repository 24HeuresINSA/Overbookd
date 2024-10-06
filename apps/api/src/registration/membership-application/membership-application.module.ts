import { Module } from "@nestjs/common";
import { StaffMembershipApplicationModule } from "./staff/staff-membership-application.module";

@Module({
  imports: [StaffMembershipApplicationModule],
})
export class MembershipApplicationModule {}
