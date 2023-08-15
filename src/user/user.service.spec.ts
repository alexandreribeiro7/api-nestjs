import { Test, TestingModule } from "@nestjs/testing"
import { beforeEach } from "node:test"
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserService } from "./user.service";
import { userRepositoryMock } from "../testing/user-repository.mock";

describe('UserService', () => {

    let userService: UserService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService, 
                userRepositoryMock
            ]
        }).compile();

        userService = module.get<UserService>(UserService);
        
    });
    
    it('Validar a definição', () => {
        expect(UserService).toBeDefined();
    })



})