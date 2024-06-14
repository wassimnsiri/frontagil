// models/commande.ts

import Produit from "./Produit";
import User from "./User";

export interface Commande {
    _id: string;
    userId: string;
    commandeprice: number;
    orderDate: string; // Utilisez string si vous recevez des dates en format ISO
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    produit : Produit // Définir les statuts possibles
    reason: string;
  }
  
  export interface GroupedCommandes {
    user: User;
     // Ajoutez l'utilisateur associé à la commande
    commandes: Commande[];
  }
  