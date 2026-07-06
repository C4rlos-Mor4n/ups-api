import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { StopsService } from './stops.service';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { StopResponseDto } from './dto/stop-response.dto';
import { StopPaginatedResponseDto } from './dto/stop-paginated-response.dto';

@ApiBearerAuth()
@ApiTags('Admin Stops')
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stop' })
  @ApiBody({ type: CreateStopDto })
  @ApiCreatedResponse({ type: StopResponseDto, description: 'Stop created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  create(
    @Body() dto: CreateStopDto,
    @CurrentUser('sub') actorId: string,
  ): Promise<StopResponseDto> {
    return this.stopsService.create(dto, actorId);
  }

  @Get()
  @ApiOperation({ summary: 'List all stops with pagination' })
  @ApiQuery({ type: PaginationDto })
  @ApiOkResponse({ type: StopPaginatedResponseDto, description: 'Paginated list of stops' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  findAll(@Query() pagination: PaginationDto): Promise<StopPaginatedResponseDto> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    return this.stopsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stop details' })
  @ApiParam({ name: 'id', description: 'Stop ID', format: 'uuid' })
  @ApiOkResponse({ type: StopResponseDto, description: 'Stop details' })
  @ApiNotFoundResponse({ description: 'Stop not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  findOne(@Param('id') id: string): Promise<StopResponseDto> {
    return this.stopsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stop' })
  @ApiParam({ name: 'id', description: 'Stop ID', format: 'uuid' })
  @ApiBody({ type: UpdateStopDto })
  @ApiOkResponse({ type: StopResponseDto, description: 'Stop updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Stop not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStopDto,
    @CurrentUser('sub') actorId: string,
  ): Promise<StopResponseDto> {
    return this.stopsService.update(id, dto, actorId);
  }
}
