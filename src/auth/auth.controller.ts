/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Headers, Controller, Post, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { AuthLoginDTO } from "./dto/auth.login.dto";
import { AuthRegisterDTO } from "./dto/auth.register.dto";
import { AuthForgetDTO } from "./dto/auth.forget.dto";
import { AuthResetDTO } from "./dto/auth.reset.dto";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { join } from "path";
import { FileService } from "file/file.service";

@Controller('auth')
export class AuthController {
    
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly fileService: FileService
        ){}

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO) {
        
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO) {

        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO) {

        return this.authService.reset(password, token);
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User(/* email, id, name, password */) user) {
    
        return { user };
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user, 
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: 'image/jpeg'}),
                new MaxFileSizeValidator({maxSize: 1024 * 1000})
            ]
        })) photo: Express.Multer.File) {

        const path = join(__dirname, '..', '..', '..', 'storage', 'photos', `photo-${user.id}.png`);

        try {
       await this.fileService.upload(photo, path);
        } catch (e) {
            throw new BadRequestException(e)
        }
        return {sucess: true};
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFile() files: Express.Multer.File) {
        return files
    }

    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    }, {
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFile() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {
        return files;
    }

}