import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {

    @IsNotEmpty({message: 'El nombre del cupón es requerido.'})
    name: string

    @IsNotEmpty({message: 'El descuento es requerido.'})
    @IsInt({message: 'El descuento debe ser entre el 1 y 100.'})
    @Max(100, {message: 'El descuento máximo es 100.'})
    @Min(1, {message: 'El descuento mínimo es 1.'})
    percentage: number

    @IsNotEmpty({message: 'La fecha es requerida.'})
    @IsDateString({}, {message: 'Fecha Inválida.'})
    expirationDate: Date
}
