import { ProductOption } from "src/Module/productOptions/entities/productOptions.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OptionPicture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    optionId: string;

    @ManyToOne(() => ProductOption, (productOption) => productOption.pictures)
    @JoinColumn({ name: 'optionId' })
    option: ProductOption;

    @Column()
    icon: string;
}

