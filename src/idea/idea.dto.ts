import { IsString, IsNotEmpty } from "class-validator";

export class IdeaDto {
    @IsNotEmpty()
    readonly idea: string;

    @IsString()
    // @IsNotEmpty()
    readonly description: string;
}