import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, isAfter, isBefore } from 'date-fns';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {

	constructor(
		@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
	) {}

	create(createCouponDto: CreateCouponDto) {
		return this.couponRepository.save(createCouponDto)
	}

	findAll() {
		return this.couponRepository.find()
	}

	private async findOneById(id: number) {
		const coupon = await this.couponRepository.findOne({ where: { id }})
		if ( !coupon ) throw new NotFoundException("Cupón Inválido.");
		return coupon
	}

	async findOne(id: number) {
		
		const coupon = await this.findOneById(id)

		// Validar que el cupón no haya expirado
		const today = new Date()
		if ( isBefore(coupon.expirationDate, today) ) throw new UnprocessableEntityException("El cupón ha expirado.");

		return coupon
	}

	async update(id: number, updateCouponDto: UpdateCouponDto) {

		const coupon = await this.findOneById(id)
		Object.assign(coupon, updateCouponDto)

		return await this.couponRepository.save(coupon)
	}

	async remove(id: number) {
		const coupon = await this.findOneById(id)
		await this.couponRepository.remove(coupon)

		return `El cupón: ${coupon.name}, ha sido eliminado correctamente.`
	}

	async applyCoupon(couponName: string) {
		const coupon = await this.couponRepository.findOneBy({name: couponName})
		if ( !coupon ) throw new NotFoundException("Cupón Inválido.");

		// Validar que el cupón no haya expirado
		const today = new Date()
		const expirationDate = endOfDay(coupon.expirationDate)
		if ( isAfter( today, expirationDate ) ) throw new UnprocessableEntityException("El cupón ha expirado.");

		return {
			message: "Cupón Válido",
			...coupon
		}
	}
}
