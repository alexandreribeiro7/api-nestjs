/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";



export class LogInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const dt = Date.now();
        
        return next.handle().pipe(tap(()=> {
            const request = context.switchToHttp().getRequest();

            console.log(`Url: ${request.url}`);
            console.log(`Method: ${request.method}`);
            console.log(`Response time: ${Date.now() - dt} milliseconds `);
        }))
    }

}