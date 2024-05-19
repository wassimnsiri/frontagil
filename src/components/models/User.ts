interface User{
    _id: string;
    email: string;
    username: string;
    password: string;
    role: string;
    profilePicture: string;
    isBanned: boolean;
    favouriteGenders: string[];
    friends: string[];
    friendRequests: string[];
    friendRequestsSent: string[];
    favouriteMovies: string[];
    isVerified: boolean;
    __v: number;
    firstName: string;
    lastName: string;
}

export default User;
