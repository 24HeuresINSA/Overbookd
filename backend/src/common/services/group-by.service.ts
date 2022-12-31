import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupByService {
  groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K) {
    return arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }
}
