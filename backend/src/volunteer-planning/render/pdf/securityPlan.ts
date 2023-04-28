import { join } from 'path';
import { Content } from 'pdfmake/interfaces';

export class SecurityPlan {
  static generatePage(): Content {
    return {
      image: join(__dirname, '../../../..', '/assets/security_plan.png'),
      fit: [680, 680],
      pageBreak: 'after',
      pageOrientation: 'portrait',
      style: {
        alignment: 'center',
      },
    };
  }
}
