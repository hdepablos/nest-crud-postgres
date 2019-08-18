import { IsString } from "class-validator";

export class IdeaDto {
    @IsString()
    readonly idea: string;

    @IsString()
    readonly description: string;
}