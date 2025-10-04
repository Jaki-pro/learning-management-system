export interface Course {
  id: number;
  attributes: {
    title: string;
    description: string;
  };
}

export interface Enrollment {
  id: number;
  attributes: {
    course: {
      data: Course;
    };
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: {
      name: string;
  };
}
