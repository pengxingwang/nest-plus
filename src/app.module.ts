import { Module } from '@nestjs/common';
import { LibsModule } from './libs/libs.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [LibsModule, ModulesModule],
})
export class AppModule {}
