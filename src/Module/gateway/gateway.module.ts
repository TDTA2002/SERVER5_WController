import { Global, Module } from '@nestjs/common';
import { CustomerGateway } from './customer.gateway';
import { JwtService } from 'src/utils/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerChat } from './entities/customer.chat.entity';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([CustomerChat])],
    controllers: [],
    providers: [CustomerGateway, JwtService, CustomerService],
    exports: [CustomerGateway]
})
export class GatewayModule { }