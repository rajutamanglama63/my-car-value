import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest()
        // console.log("req from CurrUserInterceptor: ", request.session)
        const { userId } = request.session;
        // console.log("user id: ", userId)
        
        if(userId) {
            const user = await this.usersService.findOne(userId)
            request.currentUser = user;
            // console.log("curr user: ", request.currentUser)
        }

        return next.handle()
    }
}