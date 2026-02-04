import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsService } from './transactions.service';
import { Product } from 'src/products/entities/product.entity';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionsContents } from './entities/transaction.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Transaction, TransactionsContents, Product])],
	controllers: [TransactionsController],
	providers: [TransactionsService],
})
export class TransactionsModule {}
