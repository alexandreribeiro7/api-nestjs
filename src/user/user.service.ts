/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutDTO } from './dto/update-put-user-dto';
import { UpdatePartialDTO } from './dto/update-patch-user-dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(data: CreateUserDTO) {
    const userExists = await this.userRepository.findOne( {where:{ email: data.email }});

    if (userExists) {
      throw new BadRequestException('This email already exists.');
    }

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async list() {
    return this.userRepository.find();
  }

  async show(id: number) {
    await this.exists(id);
    return this.userRepository.findOneBy({
        id
    });
  }

  async update(id: number, { email, name, password, birthAt, role }: UpdatePutDTO) {
    await this.exists(id);
    const updatedData: Partial<UserEntity> = {};

    if (email) updatedData.email = email;
    if (name) updatedData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt();
      updatedData.password = await bcrypt.hash(password, salt);
    }
    if (birthAt) updatedData.birthAt = new Date(birthAt);
    if (role) updatedData.role = role;

    await this.userRepository.update(id, updatedData);
    return this.show(id);
  }
  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePartialDTO,
  ) {
    await this.exists(id);
    const updatedData: Partial<UserEntity> = {};

    if (email) updatedData.email = email;
    if (name) updatedData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt();
      updatedData.password = await bcrypt.hash(password, salt);
    }
    if (birthAt) updatedData.birthAt = new Date(birthAt);
    if (role) updatedData.role = role;

    await this.userRepository.update(id, updatedData);
    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);
    return this.userRepository.delete(id);
  }

  private async exists(id: number) {
    const userExists = await this.userRepository.findOne( {where:{ id }});

    if (!userExists) {
      throw new NotFoundException('The user does not exist.');
    }
  }
}