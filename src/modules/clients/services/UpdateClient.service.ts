import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import Client from '@modules/clients/infra/prisma/models/Client';
import UpdateClientDTO from '@modules/clients/dtos/UpdateClient.dto';
import IClientRepository from '@modules/clients/repositories/IClientRepository';
import ICEPQueryProvider from '@modules/clients/providers/CEPQueryProvider/models/ICEPQueryProvider';

@Injectable()
export default class UpdateClientService {
  constructor(
    @Inject('ClientRepository')
    private readonly clientRepository: IClientRepository,

    @Inject('CEPQueryProvider')
    private readonly cepQueryProvider: ICEPQueryProvider
  ) {}

  public async execute({
    client_id,
    cnpj,
    cep,
    address_number,
    corporate_name,
    fantasy_name,
    name,
    nfe_email,
    phone,
    state_registration,
  }: UpdateClientDTO): Promise<Client> {
    const client = await this.clientRepository.findById(client_id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (cnpj) {
      const parsedCNPJ = cnpj
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, '$1 $2 $3/$4-$5');

      const findClientWithThisCnpj = await this.clientRepository.findByCnpj(
        parsedCNPJ
      );

      if (findClientWithThisCnpj && findClientWithThisCnpj.id !== client.id) {
        throw new BadRequestException('CNPJ já está em uso.');
      }

      client.cnpj = parsedCNPJ;
    }

    if (cep) {
      const cepInfo = await this.cepQueryProvider.getCEPInfo(cep);

      const address = this.cepQueryProvider.buildAddress(cepInfo);

      client.cep = cep;
      client.address = address;
    }

    if (nfe_email) {
      const isNfeEmailAlreadyUsed = await this.clientRepository.findByNfeEmail(
        nfe_email
      );

      if (isNfeEmailAlreadyUsed)
        throw new BadRequestException('E-mail da nota fiscal já usado.');

      client.nfe_email = nfe_email;
    }

    if (address_number) client.address_number = address_number;
    if (corporate_name) client.corporate_name = corporate_name;
    if (fantasy_name) client.fantasy_name = fantasy_name;
    if (name) client.name = name;
    if (phone) client.phone = phone;
    if (state_registration) client.state_registration = state_registration;

    await this.clientRepository.update(client);

    return client;
  }
}
