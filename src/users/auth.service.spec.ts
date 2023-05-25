import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from "./user.entity"
import { UsersService } from "./users.service"
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe("AuthService", () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        // fake UsersService or clone of UsersService for testing purpose
        const users: User[] = []
        fakeUsersService = {
            find: (email: string) => {
                const filtredUsers = users.filter((user) => user.email === email)
                return Promise.resolve(filtredUsers)
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 999999), email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();

        service = module.get(AuthService)
    })

    it("can create an instance of auth service", async () => {
        expect(service).toBeDefined();
    })

    it("creates a new user with salted and hassed password", async () => {
        const user = await service.signup("diamond@gmail.com", "1234")

        expect(user.password).not.toEqual("1234")
        const [salt, hash] = user.password.split(".")
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it("throws an error if user signsup with email that is already in use", async () => {
        // fakeUsersService.find = () => Promise.resolve([{id: 1, email: "diamond@gmail.com", password: "1234"} as User])

        await service.signup('diamond@asdf.com', 'asdf');

        await expect(service.signup('diamond@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    })

    it("throws an error if signin is called with an unused email", async () => {
        await expect(
            service.signin("diamong@gmail.com", "1234"),
        ).rejects.toThrow(NotFoundException)
    })

    it("throws an error if an invalid password is provided", async () => {
        // fakeUsersService.find = () => Promise.resolve([{email: "diamond@gmail.com", password: "1234"} as User])

        await service.signup('diamond@gmail.com', 'password');

        await expect(service.signin("diamond@gmail.com", "example")).rejects.toThrow(BadRequestException)
    })

    it("returns a user if correct password is provided", async () => {
        await service.signup("example@gmail.com", "1234")

        const user = await service.signin("example@gmail.com", "1234")
        expect(user).toBeDefined();
    })

})