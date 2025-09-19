// Korean mappings for English values in hospital data

// Business type mappings (진료 동물)
export const businessTypeMapping: Record<string, string> = {
  'DOG': '반려견',
  'CAT': '고양이', 
  'EXOTIC': '특수동물',
  'LARGE_ANIMAL': '대동물',
  'small_animal': '소동물',
  'large_animal': '대동물',
  'exotic_animal': '특수동물',
  'mixed_practice': '종합진료',
  'companion_animal': '반려동물',
  'livestock': '가축',
  'wildlife': '야생동물',
  'aquatic_animal': '수생동물',
  'dog': '개',
  'cat': '고양이',
  'bird': '조류',
  'rabbit': '토끼',
  'hamster': '햄스터',
  'guinea_pig': '기니피그',
  'ferret': '페럿',
  'reptile': '파충류',
  'fish': '어류',
};

// Specialty mappings (진료 분야)
export const specialtyMapping: Record<string, string> = {
  'INTERNAL_MEDICINE': '내과',
  'SURGERY': '외과',
  'DERMATOLOGY': '피부과',
  'OPHTHALMOLOGY': '안과',
  'DENTISTRY': '치과',
  'internal_medicine': '내과',
  'surgery': '외과',
  'dermatology': '피부과',
  'ophthalmology': '안과',
  'dentistry': '치과',
  'orthopedics': '정형외과',
  'neurology': '신경과',
  'cardiology': '심장내과',
  'oncology': '종양학',
  'emergency': '응급의학',
  'anesthesiology': '마취과',
  'radiology': '영상의학과',
  'pathology': '병리학',
  'behavior': '행동학',
  'nutrition': '영양학',
  'preventive_medicine': '예방의학',
  'reproduction': '번식학',
  'laboratory_medicine': '임상병리학',
  'pharmacy': '약학',
  'rehabilitation': '재활의학',
  'acupuncture': '침술',
  'holistic_medicine': '통합의학',
  'exotic_medicine': '특수동물의학',
  'zoo_medicine': '동물원의학',
  'wildlife_medicine': '야생동물의학',
  'aquatic_medicine': '수생동물의학',
  'poultry_medicine': '가금류의학',
  'swine_medicine': '돼지의학',
  'bovine_medicine': '소의학',
  'equine_medicine': '말의학',
  'small_ruminant_medicine': '소반추동물의학',
};

// Function to map business type to Korean
export function mapBusinessTypeToKorean(businessType: string): string {
  return businessTypeMapping[businessType] || businessType;
}

// Function to map specialty to Korean
export function mapSpecialtyToKorean(specialty: string): string {
  return specialtyMapping[specialty] || specialty;
}

// Function to map array of specialties to Korean
export function mapSpecialtiesToKorean(specialties: string[]): string[] {
  return specialties.map(mapSpecialtyToKorean);
}

// Function to map array of business types to Korean
export function mapBusinessTypesToKorean(businessTypes: string[]): string[] {
  return businessTypes.map(mapBusinessTypeToKorean);
}