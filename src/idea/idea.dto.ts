import { IsString, IsNotEmpty } from "class-validator";
import { UserRO } from "user/user.dto";

export class IdeaDto {
    @IsNotEmpty()
    readonly idea: string;

    @IsString()
    // @IsNotEmpty()
    readonly description: string;
}

export class IdeaRO{
    id?: string;
    updated: Date;
    created: Date;
    idea: string;
    description: string;
    author: UserRO;
    upvotes?: number;
    downvotes?: number;
}