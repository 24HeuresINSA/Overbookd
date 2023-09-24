import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "./constants";
import { JwtPayload } from "./entities/jwt-util.entity";

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
