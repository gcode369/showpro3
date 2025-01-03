export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  openHouseId: string;
  registrationDate: string;
  notes?: string;
  interestedInSimilar: boolean;
  prequalified?: boolean;
  followUpStatus: 'pending' | 'contacted' | 'not-interested';
};