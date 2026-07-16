import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "@overbookd/registration";
import { jwtConstants } from "../../../jwt-constants";

export function checkStaffInvitationTokenValidity(token: string): boolean {
  try {
    jwt.verify(token, jwtConstants.secret);
    return true;
  } catch (_) {
    return false;
  }
}

export function createStaffInvitationToken(): string {
  return jwt.sign({}, jwtConstants.secret, { expiresIn: JWT_EXPIRES_IN });
}
