import { IsString, IsEmail, MinLength } from 'class-validator';

export class UserDto {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  createdAt!: string;
  updatedAt!: string;
}

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}

export class UpdateUserDto {
  @IsEmail()
  email?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}
