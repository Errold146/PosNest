import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Product } from "src/products/entities/product.entity";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal')
    total: number

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
    transactionDate: Date

    @OneToMany(() => TransactionsContents, (transction) => transction.transaction)
    contents: TransactionsContents[]
}

@Entity()
export class TransactionsContents {

    @PrimaryGeneratedColumn()
    id: number

    @Column('int')
    quantity: number
    
    @Column('decimal')
    price: number

    @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true })
    product: Product

    @ManyToOne(() => Transaction, (transaction) => transaction.contents, { cascade: true })
    transaction: Transaction
}
