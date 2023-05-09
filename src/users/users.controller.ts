import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user-dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
        ) {}

    @Post("/signup")
    createUser(@Body() body: CreateUserDto) {
        this.authService.signup(body.email, body.password)
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    // @Serialize(UserDto)
    @Get("/:id") 
    findUser(@Param("id") id: string) {
        // console.log("running from controller. it should be run after interceptor's first log")
        return this.usersService.findOne(parseInt(id))
    }

    @Get()
    findAllUsers(@Query("email") email: string) {
       return this.usersService.find(email)
    }

    @Delete("/:id") 
    removeUser(@Param("id") id: string) {
        return this.usersService.delete(parseInt(id))
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }
}
