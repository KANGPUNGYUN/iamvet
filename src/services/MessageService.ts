export class MessageService {
  async getMessages() {
    return [];
  }
  
  async getMessage(id: string) {
    return { id, content: 'Message content' };
  }
}