interface User {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    username: string;
    password: string;
    selectedgift?: string;
    role?: string;
    birthDate?: Date;
    bio?: string;
    profilePicture?: string;
    friends?: string[]; // IDs des amis
    friendRequests?: string[]; // IDs des demandes d'amis reçues
    friendRequestsSent?: string[]; // IDs des demandes d'amis envoyées
    favouriteMovies?: string[]; // IDs des films favoris
    isBanend?: boolean;
    lastGiftReceivedDate?: Date;
    favouriteGenders?: string[]; // Genres de films favoris
    isVerified?: boolean;
    resetVerificationToken?: string;
    verificationToken?: string;
  }
  
  export default User;
  