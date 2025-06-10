export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }
  
  export interface TaskCreate {
    title: string;
    description: string;
    completed?: boolean;
  }
  
  export interface UserLogin {
    username: string;
    password: string;
  }
  
  export interface Token {
    access_token: string;
    token_type: string;
  }
  
  export interface UserSignup {
    username: string;
    password: string;
  }
  