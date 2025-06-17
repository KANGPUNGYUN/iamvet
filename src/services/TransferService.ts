export class TransferService {
  async getTransfers() {
    return [];
  }
  
  async getTransfer(id: string) {
    return { id, title: 'Transfer Title' };
  }
}