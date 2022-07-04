import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import IClientRepository from '@modules/clients/repositories/IClientRepository';
import CreateClientDTO from '@modules/clients/dtos/CreateClient.dto';
import Client from '@modules/clients/infra/prisma/models/Client';
import { PrismaService } from '@shared/services/Prisma.service';
import PaginationRequestDTO from '@shared/dtos/PaginationRequest.dto';

@Injectable()
export default class ClientRepository implements IClientRepository {
  constructor(
    @Inject(PrismaService)
    private ormRepository: PrismaClient
  ) {}

  public async findById(id: string): Promise<Client | null> {
    const client = await this.ormRepository.client.findUnique({
      where: { id },
    });

    return client;
  }

  public async findAllClients({
    page,
    take,
  }: Required<PaginationRequestDTO>): Promise<Client[]> {
    const skip = page === 1 ? 0 : page * take - take;

    const clients = await this.ormRepository.client.findMany({ skip, take });

    return clients;
  }

  public async findByCnpj(cnpj: string): Promise<Client | null> {
    const client = await this.ormRepository.client.findUnique({
      where: { cnpj },
    });

    return client;
  }

  public async findByNfeEmail(nfe_email: string): Promise<Client | null> {
    const client = await this.ormRepository.client.findFirst({
      where: { nfe_email },
    });

    return client;
  }

  public async delete(id: string): Promise<Client> {
    const deleteClient = await this.ormRepository.client.delete({
      where: { id },
    });

    return deleteClient;
  }

  public async create(clientData: CreateClientDTO): Promise<Client> {
    const client = await this.ormRepository.client.create({
      data: clientData,
    });

    return client;
  }

  public async update(client: Client): Promise<Client> {
    const { id, ...rest } = client;

    const updateUser = await this.ormRepository.client.update({
      data: rest,
      where: { id },
    });

    return updateUser;
  }
}
