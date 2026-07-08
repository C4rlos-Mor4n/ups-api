import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MAIL_PROVIDER } from './interfaces/mail-provider.interface';
import { SmtpMailProvider } from './providers/smtp.mail-provider';
import { DevMailProvider } from './providers/dev.mail-provider';
import { AppConfig } from '../../../config/app.config';

@Module({
  imports: [ConfigModule],
  providers: [
    MailService,
    {
      provide: MAIL_PROVIDER,
      useFactory: (configService: ConfigService<AppConfig>) => {
        const logger = new Logger('MailModule');
        const appConfig = configService.get<AppConfig>('app', { infer: true });
        const nodeEnv = appConfig?.nodeEnv;
        
        logger.log(`MailModule: nodeEnv=${nodeEnv}, appConfig exists=${!!appConfig}`);
        logger.log(`MailModule: SMTP config: host=${appConfig?.smtp?.host}, user=${appConfig?.smtp?.user ? '***' : 'undefined'}`);
        
        if (nodeEnv === 'production') {
          logger.log('MailModule: Using SmtpMailProvider');
          return new SmtpMailProvider(configService);
        }
        logger.log('MailModule: Using DevMailProvider');
        return new DevMailProvider();
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailService],
})
export class MailModule {}
