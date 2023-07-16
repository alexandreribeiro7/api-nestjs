/* eslint-disable prettier/prettier */
import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {

  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @IsJWT()
  token:string;
}
