

export interface Reclamation {
    _id: string;
    userId: string;
    message: number;
   // Utilisez string si vous recevez des dates en format ISO
    status: 'pending' | 'Unpaidtreated' ;
  }
  export default Reclamation;