
import { OptionPicture } from "src/Module/productOption-picture/entities/productOption-picture.entity";
import { Product } from "src/Module/products/entities/product.entity";
import { ReceiptDetail } from "src/Module/receipts/entities/receipt-detail.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (Product) => Product.options)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    price: number;


    @Column({
        default: false
    })
    status: boolean;

    @Column()
    title: string;

    @OneToMany(() => OptionPicture, (optionPicture) => optionPicture.option)
    pictures: OptionPicture[];

    @OneToMany(() => ReceiptDetail, (receiptDetail) => receiptDetail.option)
    sold: ReceiptDetail[];
}
