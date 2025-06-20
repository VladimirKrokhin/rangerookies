import {
  JsonController,
  Post,
  Body,
  HttpCode,
  Req,
  Get,
  Authorized,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { AuthService } from '../services/auth.service';
import {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RegisterResponseDto,
  RequestWithUser,
} from '@app/dto';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Войти в систему',
    responses: {
      '200': {
        description: 'Пользователь успешно вошёл в систему',
      },
    },
  })
  public async login(
    @Body() loginDto: LoginDto,
  ): Promise<LoginResponseDto | { message: string }> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('/register')
  @HttpCode(201)
  @OpenAPI({
    summary: 'Зарегистрировать нового пользователя',
    responses: {
      '201': {
        description: 'Пользователь зарегистрирован успешно',
      },
    },
  })
  public async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto | { message: string }> {
    return this.authService.register(registerDto);
  }

  @Get('/profile')
  @Authorized()
  @HttpCode(200)
  @OpenAPI({
    summary: 'Получить профиль пользователя',
    responses: {
      '200': {
        description: 'Профиль получен успешно',
      },
    },
  })
  public async getProfile(
    @Req() _: RequestWithUser,
  ): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'Профиль получен успешно',
    };
  }

  @Post('/validate-token')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Проверить JWT токен',
    responses: {
      '200': {
        description: 'Токен действителен',
      },
    },
  })
  public async validateToken(
    @Body() body: { token: string },
  ): Promise<{ valid: boolean; userId?: number; message: string }> {
    try {
      const result = await this.authService.validateToken(body.token);
      if (result) {
        return {
          valid: true,
          userId: result.userId,
          message: 'Токен действителен',
        };
      } else {
        return {
          valid: false,
          message: 'Токен недействителен',
        };
      }
    } catch (error) {
      return {
        valid: false,
        message: 'Ошибка при валидации токена',
      };
    }
  }
}
