import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthTokensDto, AuthUserDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('request-code')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'Request an OTP verification code' })
  @ApiCreatedResponse({ description: 'Verification code sent' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests. Try again later.' })
  requestCode(@Body() dto: RequestCodeDto): Promise<{ message: string; devCode?: string }> {
    return this.authService.requestCode(dto);
  }

  @Public()
  @Post('verify-code')
  @ApiOperation({ summary: 'Verify OTP and obtain access/refresh tokens' })
  @ApiCreatedResponse({ type: AuthTokensDto, description: 'Tokens generated successfully' })
  verifyCode(@Body() dto: VerifyCodeDto): Promise<AuthTokensDto> {
    return this.authService.verifyCode(dto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiCreatedResponse({ type: AuthTokensDto, description: 'Tokens refreshed successfully' })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.authService.refresh(dto);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke session' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  logout(@Body() dto: LogoutDto): Promise<{ message: string }> {
    return this.authService.logout(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ type: AuthUserDto, description: 'Current user' })
  getMe(@CurrentUser('sub') userId: string): Promise<AuthUserDto> {
    return this.authService.getMe(userId);
  }
}
