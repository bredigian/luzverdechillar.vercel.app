export interface SigninFormProps {
  username: string
  password: string
}

export interface UserProps extends SigninFormProps {
  _id: string
  firstName: string
  lastName: string
}

export interface SessionProps extends UserProps {
  access_token: string
  exp: number
}
