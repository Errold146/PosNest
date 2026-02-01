import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {

    @IsNotEmpty({message: 'El nombre del producto es requerido.'})
    @IsString({message: 'Nombre Inválido.'})
    name: string

    @IsNotEmpty({message: 'El precio del producto es requerido.'})
    @IsNumber({maxDecimalPlaces: 2}, {message: 'Precio Inválido.'})
    price: number

    @IsNotEmpty({message: 'La cantidad es requerida.'})
    @IsNumber({maxDecimalPlaces: 0}, {message: 'Cantidad Inválida.'})
    inventory: number

    @IsNotEmpty({message: 'La categoría es requerida.'})
    @IsInt({message: 'Categoría Invalida.'})
    categoryId: number
}
