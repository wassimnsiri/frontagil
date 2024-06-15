

export interface Reclamation {
    _id: string;
    userId: string;
    username: string;
    message: string;
    adminComment:string;
   // Utilisez string si vous recevez des dates en format ISO
    status: 'pending' | 'treated' ;
  }
  export default Reclamation;