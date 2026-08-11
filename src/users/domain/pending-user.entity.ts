import { Role } from '../role.enum';

export class PendingUserEntity {
  private constructor(
    public readonly id: string,
    private _firstName: string,
    private _lastName: string,
    private readonly _email: string,
    private _password: string,
    private _role: Role,
    private _otpHash: string,
    private _expiresAt: Date,
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
    otpHash: string;
    expiresAt: Date;
  }): PendingUserEntity {
    const now = new Date();
    return new PendingUserEntity(
      props.id,
      props.firstName,
      props.lastName,
      props.email,
      props.hashedPassword,
      props.role ?? Role.USER,
      props.otpHash,
      props.expiresAt,
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
    otpHash: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }): PendingUserEntity {
    return new PendingUserEntity(
      props.id,
      props.firstName,
      props.lastName,
      props.email,
      props.password,
      props.role,
      props.otpHash,
      props.expiresAt,
      props.createdAt,
      props.updatedAt,
    );
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
  get otpHash() {
    return this._otpHash;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
