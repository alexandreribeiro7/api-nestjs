/* eslint-disable prettier/prettier */
import { CreateUserDTO } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePartialDTO extends PartialType(CreateUserDTO) {}
