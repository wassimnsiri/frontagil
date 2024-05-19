import Depot from "./Depot";

interface Chauffeur {
    _id: string;
    nom: string;
    prenom: string;
    telephone: string;
    depot: Depot;
    profilePicture: string;
    disponible: boolean;



}

export default Chauffeur