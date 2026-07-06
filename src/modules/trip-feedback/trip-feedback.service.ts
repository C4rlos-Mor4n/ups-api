import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateTripFeedbackDto } from './dto/create-trip-feedback.dto';
import { TripFeedbackResponseDto } from './dto/trip-feedback-response.dto';
import { buildPaginatedResponse } from '../../common/utils/pagination.util';
import { PaginatedResponse } from '../../common/types/pagination.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class TripFeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async create(
    dto: CreateTripFeedbackDto,
    userId: string,
    actorId: string,
  ): Promise<TripFeedbackResponseDto> {
    // Validar que la ruta exista
    const route = await this.prisma.route.findUnique({
      where: { id: dto.routeId },
    });
    if (!route) {
      throw new NotFoundException(`Route with id ${dto.routeId} not found`);
    }

    // Validar que el conductor exista si se proporciona
    if (dto.driverId) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: dto.driverId },
      });
      if (!driver) {
        throw new NotFoundException(`Driver with id ${dto.driverId} not found`);
      }
    }

    const feedback = await this.prisma.tripFeedback.create({
      data: {
        userId,
        routeId: dto.routeId,
        driverId: dto.driverId ?? null,
        rating: dto.rating,
        comment: dto.comment ?? null,
        travelDate: dto.travelDate ? new Date(dto.travelDate) : null,
      },
    });

    const metadata: Prisma.JsonObject = { routeId: dto.routeId, rating: dto.rating };
    await this.auditLogs.logAction(
      actorId,
      'CREATE',
      'TripFeedback',
      feedback.id,
      metadata,
    );

    return this.mapToResponse(feedback);
  }

  async findAll(
    page: number,
    limit: number,
    userId?: string,
    routeId?: string,
  ): Promise<PaginatedResponse<TripFeedbackResponseDto>> {
    const where: Prisma.TripFeedbackWhereInput = {};
    if (userId) where.userId = userId;
    if (routeId) where.routeId = routeId;

    const [data, total] = await Promise.all([
      this.prisma.tripFeedback.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tripFeedback.count({ where }),
    ]);

    return buildPaginatedResponse(
      data.map((f) => this.mapToResponse(f)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<TripFeedbackResponseDto> {
    const feedback = await this.prisma.tripFeedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException(`TripFeedback with id ${id} not found`);
    }
    return this.mapToResponse(feedback);
  }

  private mapToResponse(feedback: {
    id: string;
    userId: string;
    routeId: string;
    driverId: string | null;
    rating: number;
    comment: string | null;
    travelDate: Date | null;
    createdAt: Date;
  }): TripFeedbackResponseDto {
    return {
      id: feedback.id,
      userId: feedback.userId,
      routeId: feedback.routeId,
      driverId: feedback.driverId,
      rating: feedback.rating,
      comment: feedback.comment,
      travelDate: feedback.travelDate?.toISOString() ?? null,
      createdAt: feedback.createdAt.toISOString(),
    };
  }
}
