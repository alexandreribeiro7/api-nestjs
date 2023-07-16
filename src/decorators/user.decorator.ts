/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext, NotFoundException} from "@nestjs/common";

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest();

    if (request.user) {
        if (filter) {

            return request.user[filter];

        } else {

        return request.user;
        }

    } else {
        
        throw new NotFoundException("User not found. Use AuthGuard on the route to get the user.");
        
    }


});