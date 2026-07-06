import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery,
  ApiBearerAuth, ApiCreatedResponse, ApiOkResponse,
  ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TripFeedbackService } from './trip-feedback.service';
import { CreateTripFeedbackDto } from './dto/create-trip-feedback.dto';
import { TripFeedbackResponseDto } from './dto/trip-feedback-response.dto';
import { TripFeedbackPaginatedResponseDto } from './dto/trip-feedback-paginated-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Trip Feedback')
@ApiBearerAuth()
@Controller('trip-feedback')
export class TripFeedbackController {
  constructor(private readonly tripFeedbackService: TripFeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create trip feedback' })
  @ApiBody({ type: CreateTripFeedbackDto })
  @ApiCreatedResponse({
    description: 'Feedback created successfully',
    type: TripFeedbackResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Route or driver not found' })
  async create(
    @Body() dto: CreateTripFeedbackDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TripFeedbackResponseDto> {
    return this.tripFeedbackService.create(dto, user.sub, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List trip feedback with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  @ApiQuery({ name: 'routeId', required: false, type: String, description: 'Filter by route ID' })
  @ApiOkResponse({
    description: 'Paginated list of feedback',
    type: TripFeedbackPaginatedResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('userId') userId?: string,
    @Query('routeId') routeId?: string,
  ): Promise<TripFeedbackPaginatedResponseDto> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    return this.tripFeedbackService.findAll(page, limit, userId, routeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiOkResponse({
    description: 'Feedback details',
    type: TripFeedbackResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Feedback not found' })
  async findOne(@Param('id') id: string): Promise<TripFeedbackResponseDto> {
    return this.tripFeedbackService.findOne(id);
  }
}
