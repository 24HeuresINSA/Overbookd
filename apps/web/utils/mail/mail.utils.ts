export type MailVars = {
  subject?: string;
  body?: string;
  to?: string;
  cc?: string;
  bcc?: string;
};

export function mailLinkForClient(mail: MailVars): string {
  const to = mail.to ?? "";
  const cc = mail.cc ? `cc=${mail.cc}` : "";
  const bcc = mail.bcc ? `bcc=${mail.bcc}` : "";
  const subject = mail.subject ? `subject=${mail.subject}` : "";
  const body = mail.body ? `body=${mail.body}` : "";

  const args = [cc, bcc, subject, body].filter((arg) => arg).join("&");

  return `mailto:${to}?${args}`;
}
