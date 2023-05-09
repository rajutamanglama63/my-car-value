import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user-dto';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor) we are commenting it because now we'll use this interceptor globally so that we can apply it to every other controllers
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
        ) {}

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)

        session.userId = user.id

        return user;
    }

    @Post("/signin")
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)

        session.userId = user.id

        return user;
    }

    @Get("/loggedinuser")   
    @UseGuards(AuthGuard)
    loggedInUser(@CurrentUser() user: User) {
        return user;
    }


    // loggedInUser(@Session() session: any) {
    //     return this.usersService.findOne(session.userId)
    // }

    @Post("/logout")
    logOut(@Session() session: any) {
        session.userId = null
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
