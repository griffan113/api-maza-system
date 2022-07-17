import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { PrismaService } from '@shared/services/Prisma.service';
import PaginationWithFiltersDTO from '@shared/dtos/PaginationWithFilters.dto';
import IOrderRepository from '@modules/orders/repositories/IOrderRepository';
import Order from '@modules/orders/infra/prisma/models/Order';

@Injectable()
export default class OrderRepository implements IOrderRepository {
  constructor(
    @Inject(PrismaService)
    private ormRepository: PrismaClient
  ) {}

  public async findById(id: string): Promise<Order | null> {
    const order = await this.ormRepository.order.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
        order_entries: true,
        statuses: true,
      },
    });

    return order;
  }

  public async findAllOrders({
    pagination,
    filter,
  }: PaginationWithFiltersDTO): Promise<Order[]> {
    const { page, take } = pagination;

    const skip = page === 1 ? 0 : page * take - take;

    const orders = await this.ormRepository.order.findMany({
      skip,
      take,
      where: {
        OR: [
          {
            order_number: {
              contains: filter,
            },
          },
          {
            client: {
              OR: [
                {
                  company_name: {
                    contains: filter,
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        client: true,
        statuses: true,
      },
    });

    return orders;
  }

  public async findByOrderCode(order_number: string): Promise<Order | null> {
    const order = await this.ormRepository.order.findFirst({
      where: { order_number },
      include: {
        client: true,
      },
    });

    return order;
  }

  public async delete(id: string): Promise<Order> {
    const deleteOrder = await this.ormRepository.order.delete({
      where: { id },
      include: { client: true },
    });

    return deleteOrder;
  }

  // public async create({
  //   contacts = [],
  //   ...rest
  // }: CreateOrderDTO): Promise<Order> {
  //   const order = await this.ormRepository.order.create({
  //     data: {
  //       ...rest,
  //       contacts: {
  //         createMany: { data: contacts },
  //       },
  //     },
  //   });

  //   return order;
  // }

  // public async update({
  //   client,
  //   contacts = [],
  // }: UpdateOrderDTO): Promise<Order> {
  //   const { id, ...rest } = client;

  //   const updateOrder = await this.ormRepository.client.update({
  //     data: {
  //       ...rest,
  //       contacts: {
  //         createMany: { data: contacts },
  //       },
  //     },
  //     where: { id },
  //   });

  //   return updateOrder;
  // }
}
