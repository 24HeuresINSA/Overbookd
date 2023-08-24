import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    const version = process.env.OVERBOOKD_VERSION;
    return `Hello from overbookd backend V${version}!`;
  }
}
