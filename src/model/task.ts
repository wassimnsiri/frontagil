import User from "./user";

interface Task {
    _id?: string;
    title?: string;
    releaseDate?: string;
    description?: string;
    recipient: User;
    state?: string;
  }
  
  export default Task;