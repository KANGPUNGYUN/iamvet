export class HospitalService {
  async getHospitals() {
    return [];
  }
  
  async getHospital(id: string) {
    return { id, name: 'Hospital Name' };
  }
}