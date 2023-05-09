import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    // console.log("req from decorator: ", request.currentUser)
    return request.currentUser;
})