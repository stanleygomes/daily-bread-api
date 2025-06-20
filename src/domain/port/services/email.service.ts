export interface IEmailService {
  sendBulkEmails(emailList: string[], subject: string, htmlBody: string): Promise<any[]>;
}
