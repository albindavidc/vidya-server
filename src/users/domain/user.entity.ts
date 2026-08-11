import { Role } from '../role.enum';

export class UserEntity {
  private constructor(
    public readonly id: string,
    private _firstName: string,
    private _lastName: string,
    private readonly _email: string,
    private _password: string,
    private _role: Role,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
    role?: Role;
  }): UserEntity {
    if (!props.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (props.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    const now = new Date();
    return new UserEntity(
      props.id,
      props.firstName,
      props.lastName,
      props.email,
      props.hashedPassword,
      props.role ?? Role.USER,
      now,
      now,
    );
  }

  static fromPersistence(props: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }): UserEntity {
    return new UserEntity(
      props.id,
      props.firstName,
      props.lastName,
      props.email,
      props.password,
      props.role,
      props.createdAt,
      props.updatedAt,
    );
  }

  promoteToAdmin(): void {
    if (this._role === Role.ADMIN) {
      throw new Error('User is already an admin');
    }
    this._role = Role.ADMIN;
    this._updatedAt = new Date();
  }

  changePassword(newHashedPassword: string): void {
    if (newHashedPassword === this._password) {
      throw new Error('New password must be different from the current one');
    }
    this._password = newHashedPassword;
    this._updatedAt = new Date();
  }

  rename(firstName: string, lastName: string): void {
    if (!firstName.trim() || !lastName.trim()) {
      throw new Error('Name cannot be empty');
    }
    this._firstName = firstName;
    this._lastName = lastName;
    this._updatedAt = new Date();
  }

  get firstName() {
    return this._firstName;
  }
  get lastName() {
    return this._lastName;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get role() {
    return this._role;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
