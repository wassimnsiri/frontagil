// models/commande.ts

import User from "./User";

export interface Commande {
    _id: string;
    userId: string;
    commandeprice: number;
    orderDate: string; // Utilisez string si vous recevez des dates en format ISO
    status: 'Paid' | 'Unpaid' | 'Pending'; // Définir les statuts possibles
  }
  
  export interface GroupedCommandes {
    user: User; // Ajoutez l'utilisateur associé à la commande
    commandes: Commande[];
  }
  