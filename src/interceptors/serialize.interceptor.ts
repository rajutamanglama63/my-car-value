import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDto } from "src/users/dtos/user-dto";

interface ClassConstructor {
    new (...args: any[]): {},
}

export function Serialize (dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled by a request handler
        // console.log("I'm running before handler: ", context)

        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                //  console.log("I'm running before response is sent out: ", data)

                // we are making use of UserDto instead of CreateUserDto -
                // - to control or to intercept response
                // by default data is using CreateUserDto, we transform it into instance of User by hijacking it
                return plainToClass(UserDto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}