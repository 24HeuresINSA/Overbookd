import { CanActivate, ExecutionContext } from '@nestjs/common';

// ts-prune-ignore-next
export class PayloadPassGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();
    const req = context.switchToHttp().getRequest();
    req.payloadData = user;

    return true;
  }
}
