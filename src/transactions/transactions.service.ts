import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { Product } from 'src/products/entities/product.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionsContents } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {

	constructor(
		@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
		@InjectRepository(TransactionsContents) private readonly transactionContentsRepository: Repository<TransactionsContents>,
		@InjectRepository(Product) private readonly productRepository: Repository<Product>,
	) {}

	async create(createTransactionDto: CreateTransactionDto) {

		await this.productRepository.manager.transaction(async ( transactionEntityManager ) => {

			const transaction = new Transaction()
			transaction.total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0)
			
			for(let contents of createTransactionDto.contents) {
				const product = await transactionEntityManager.findOneBy(Product, {id: contents.productId})
				let errors: string[] = []

				if (!product) {
					errors.push(`El Producto con el ID: ${contents.productId}, no existe.`)
					throw new NotFoundException(errors);
				}

				if ( contents.quantity > product.inventory ) {
					errors.push(`El artículo ${product.name}, excede la cantidad disponible.`)
					throw new BadRequestException(errors)
				}
				product.inventory -= contents.quantity
				
				// Create TransactionContents instance
				const transactionContent = new TransactionsContents();
				transactionContent.quantity = contents.quantity;
				transactionContent.price = contents.price;
				transactionContent.product = product;
				transactionContent.transaction = transaction;
				
				await  transactionEntityManager.save(transaction)
				await transactionEntityManager.save(transactionContent);
			}
		})
		
		return "Venta almacenada correctamente.";
	}

	findAll(transactionDate?: string) {

		const options: FindManyOptions<Transaction> = {
			relations: {
				contents: true
			}
		}

		if ( transactionDate ) {
			const date = parseISO(transactionDate)
			if ( !isValid(date) ) throw new BadRequestException("Fecha Inválida.");

			const start = startOfDay(date)
			const end = endOfDay(date)
			
			options.where = {
				transactionDate: Between(start, end)
			}
		}

		return this.transactionRepository.find(options)
	}

	async findOne(id: number) {

		const transaction = await this.transactionRepository.findOne({
			where: {
				id
			},
			relations: {
				contents: true
			}
		})

		if ( !transaction ) throw new NotFoundException("Transacción Inválida.");

		return transaction
	}

	async remove(id: number) {

		const transaction = await this.findOne(id)

		// Usar transacción para garantizar que todo se haga de forma atómica
		await this.productRepository.manager.transaction(async (transactionEntityManager) => {
			
			// Devolver inventario de cada producto en la transacción
			for (const content of transaction.contents) {
				const product = await transactionEntityManager.findOneBy(Product, { id: content.product.id })
				
				if (product) {
					product.inventory += content.quantity
					await transactionEntityManager.save(product)
				}
			}

			// Eliminar contenidos de la transacción
			if (transaction.contents && transaction.contents.length > 0) {
				await transactionEntityManager.remove(transaction.contents)
			}

			// Eliminar la transacción
			await transactionEntityManager.remove(transaction)
		})

		return { message: `La Transacción con el ID: ${id} fue eliminada correctamente.` };
	}
}
