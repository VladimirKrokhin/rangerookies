import { CreateUserDto, UpdateUserDto, UserDto } from '../user.dto';

export interface IUserService {
  getAll(): Promise<UserDto[]>;
  getById(id: number): Promise<UserDto>;
  create(user: CreateUserDto): Promise<UserDto>;
  update(id: number, user: UpdateUserDto): Promise<UserDto>;
  delete(id: number): Promise<void>;
  getMe(): Promise<UserDto>;
}
