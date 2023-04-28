import { join } from 'path';
import { Content } from 'pdfmake/interfaces';

export class SecurityPlan {
  static generatePage(): Content {
    return {
      image: join(__dirname, '../../../..', '/assets/security_plan.png'),
      fit: [700, 700],
      pageBreak: 'after',
      style: {
        alignment: 'center',
      },
    };
  }
}
