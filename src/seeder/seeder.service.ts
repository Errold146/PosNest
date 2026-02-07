import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { products } from './data/products';
import { categories } from './data/categories';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class SeederService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepositry: Repository<Category>,
        @InjectRepository(Product) private readonly porductRepository: Repository<Product>,
        private dataSource: DataSource
    ){}

    private async resetDatabase() {
        await this.dataSource.dropDatabase()
        await this.dataSource.synchronize()
    }

    async seed() {
        await this.resetDatabase()
        const savedCategories = await this.categoryRepositry.save(categories)
        console.log(`Seed: inserted categories: ${savedCategories.length}`)

        let insertedProducts = 0
        for (const seedProducts of products) {
            const category = await this.categoryRepositry.findOneBy({ id: seedProducts.categoryId })
            if (!category) {
                throw new Error(`Category id not found for product seed: ${seedProducts.name}`)
            }

            const product = new Product()

            product.name = seedProducts.name
            product.image = seedProducts.image
            product.price = seedProducts.price
            product.inventory = seedProducts.inventory
            product.category = category
            product.categoryId = category.id
            await this.porductRepository.save(product)
            insertedProducts += 1
        }
        console.log(`Seed: inserted products: ${insertedProducts}`)
    }
}
