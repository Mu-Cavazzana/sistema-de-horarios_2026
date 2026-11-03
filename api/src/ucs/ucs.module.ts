import { Module } from '@nestjs/common';
import { UcsController } from './ucs.controller';
import { UcsService } from './ucs.service';

@Module({ controllers: [UcsController], providers: [UcsService] })
export class UcsModule {}
