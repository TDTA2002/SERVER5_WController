
import { User } from "src/Module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CustomerChats {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string;
  
    @ManyToOne(() => User, (user) => user.customerChats)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({
        nullable: true
    })
    adminId: string | null;

    @ManyToOne(() => User, (user) => user.adminChats)
    @JoinColumn({ name: 'adminId' })
    admin: User;

    @Column()
    content: string;

    @Column()
    time: string;

    @Column({ nullable: true })
    replyToId: string | null;

    @Column()
    discordChannelId: string;
}