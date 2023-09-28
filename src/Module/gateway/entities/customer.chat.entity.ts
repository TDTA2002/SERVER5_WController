import { User } from "src/Module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

enum ChatType {
    ADMIN = "ADMIN",
    USER = "USER"
}


@Entity()
export class CustomerChat {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string;


    @ManyToOne(() => User, (user) => user.customerChat)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: ChatType })
    type: ChatType;

    @Column()
    adminId: string;

    @Column()
    time: string;

    @Column()
    content: string;

    @Column()
    textChannelDiscordId: string;
}