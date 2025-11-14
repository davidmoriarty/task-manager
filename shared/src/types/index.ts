export type ApiResponse = {
   message: string;
   success: true;
};

export interface User {
   id: string;
   username: string;
   email: string;
}

export interface Task {
   id: string;
   title: string;
   completed: boolean;
   userId: string;
}
