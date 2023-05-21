export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  secretToken?: string;
}

export class User {
  public props: Required<IUser>;

  constructor(props: IUser) {
    this.props = {
      ...props,
      secretToken: props.secretToken || '',
      id: props.id || '',
    };
  }

  updateName(name: string) {
    this.props.name = name;
  }

  updateEmail(email: string) {
    this.props.email = email;
  }

  updatePassword(password: string) {
    this.props.password = password;
  }

  createSecretToken(secretToken: string) {
    this.props.secretToken = secretToken;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
    };
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get secretToken() {
    return this.props.secretToken;
  }
}
