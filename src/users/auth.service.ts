import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const existingUsers = await this.usersService.find(email)

        if(existingUsers.length) {
            throw new BadRequestException("User with this email already exists. ")
        }

        // generate a salt
        const salt = randomBytes(8).toString("hex")

        // hash the salt and password together
        const hash = (await scrypt(password, salt, 32) as Buffer)

        // join the hassed password and the salt together
        const hassedPassword = salt + "." + hash.toString("hex")

        // create a new user and save it
        const user = await this.usersService.create(email, hassedPassword)

        // return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email)

        if(!user) {
            throw new NotFoundException("User not found.")
        }

        const [salt, storedHassedPswd] = user.password.split(".")

        const hassedPswd = (await scrypt(password, salt, 32)) as Buffer

        if(storedHassedPswd !== hassedPswd.toString("hex")) {
            throw new BadRequestException('Invalid Credentials')
        }

        return user;
    }
}