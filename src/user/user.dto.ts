import { IsNotEmpty } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;
}

export class UserRO {
    id: string;
    username: string;
    created: Date;
    token?: string;
}