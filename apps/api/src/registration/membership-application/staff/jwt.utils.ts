import jwt from "jsonwebtoken";
import { jwtConstants } from "../../../authentication/jwt-constants";

export function checkStaffInvitationTokenValidity(token: string): boolean {
  try {
    jwt.verify(token, jwtConstants.secret);
    return true;
  } catch (_) {
    return false;
  }
}

export function createStaffInvitationToken(): string {
  return jwt.sign({}, jwtConstants.secret, { expiresIn: "30d" });
}
