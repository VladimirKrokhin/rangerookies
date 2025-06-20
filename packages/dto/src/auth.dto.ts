import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @IsString()
  username!: string;

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

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class LoginResponseDto {
  token!: string;
  user!: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export class RegisterResponseDto {
  token!: string;
  user!: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export class SuccessResponseDto {
  success!: boolean;
  message?: string;
}
