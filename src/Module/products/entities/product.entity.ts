import { Category } from "src/Module/categories/entities/category.entity";
import { ProductOption } from "src/Module/productOptions/entities/productOptions.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    categoryId: string;

    @ManyToOne(() => Category, (Category) => Category.Product)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    name: string;

    @Column()
    des: string;


    @OneToMany(() => ProductOption, (productOption) => productOption.product)
    options: ProductOption[];
}
