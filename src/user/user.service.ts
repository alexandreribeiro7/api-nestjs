/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutDTO } from './dto/update-put-user-dto';
import { UpdatePartialDTO } from './dto/update-patch-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  login: any;
  constructor() {}

  async create(data: CreateUserDTO) {

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt)

    return this.prisma.user.create({
      data,
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, { email, name, password, birthAt, role }: UpdatePutDTO) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt)

    return this.prisma.user.update({
      data: {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null, role
      },
      where: {
        id,
      },
    });
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

    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (!(await this.prisma.user.count({
      where: {
        id
      }
    }))) {
      throw new NotFoundException(`The user does not exist.`);
    }
  }
}
