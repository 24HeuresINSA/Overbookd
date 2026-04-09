import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./entities/jwt-util.entity";
import { jwtConstants } from "./jwt-constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate({
    userId,
    teams,
    permissions,
    id,
    username,
  }: JwtPayload & unknown): Promise<JwtPayload> {
    return {
      userId,
      teams,
      permissions,
      id,
      username,
    };
  }
}
