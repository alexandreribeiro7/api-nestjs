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
  login: any;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(data: CreateUserDTO) {

      if (await this.userRepository.exist({
        where: { 
          email: data.email 
        }
      })) {
        throw new BadRequestException('This email already exists.')
      }

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt)

    const user = this.userRepository.create(data);

    return this.userRepository.save(user)

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

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt)

    await this.userRepository.update(id, {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null, 
        role
      });

      return this.show(id);
    }
  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePartialDTO,
  ) {
    await this.exists(id);

    const data: any = {};

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, salt)
    }

    if (role) {
      data.role = role;
    }

    await this.userRepository.update(id, data);

    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);

    return this.userRepository.delete(id);
  }

  async exists(id: number) {

    if (!(await this.userRepository.exist({
      where: {
        id
      }
    }))) {
      throw new NotFoundException(`The user does not exist.`);
    }
  }
}
