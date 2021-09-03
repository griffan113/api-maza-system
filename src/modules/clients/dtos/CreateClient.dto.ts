import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PersonType } from '../types/PersonTypeEnum';

class CreateClientDTO {
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([PersonType.LEGAL, PersonType.PHYSICAL])
  person_type: PersonType;

  @IsOptional()
  @Matches(
    /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g
  )
  // @ValidateIf((o) => isEmpty(o.cnpj), {})
  cpf?: string;

  @IsOptional()
  @Matches(
    /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g
  )
  cnpj?: string;

  @IsOptional()
  @IsString()
  financial_contact_name?: string;

  @IsOptional()
  @IsString()
  technician_contact_name?: string;

  @IsOptional()
  @IsEmail()
  financial_contact_email?: string;

  @IsOptional()
  @IsEmail()
  technician_contact_email?: string;

  @IsEmail()
  invoice_email: string;
}

export default CreateClientDTO;
