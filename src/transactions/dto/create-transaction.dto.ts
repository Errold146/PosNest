import { Type } from "class-transformer";
import {  ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

export class TransactionContentsDto {
    @IsNotEmpty({ message: 'El ID del producto es requerido.' })
    @IsInt({ message: 'Producto Inválido.' })
    productId: number;

    @IsNotEmpty({ message: 'La Cantidad es requerida.' })
    @IsInt({ message: 'Cantidad Inválida.' }) // Validate quantity too
    quantity: number;

    @IsNotEmpty({ message: 'El Precio es requerido.' })
    @IsNumber({}, { message: 'Precio Inválido.' })
    price: number;
}

export class CreateTransactionDto {
    @IsNotEmpty({message: 'El Total es requerido.'})
    @IsNumber({}, {message: 'Cantidad Inválida.'})
    total: number

    @IsArray()
    @ArrayNotEmpty({message: 'Los Contenidos son requeridos.'})
    @ValidateNested()
    @Type(() => TransactionContentsDto)
    contents: TransactionContentsDto[]
}