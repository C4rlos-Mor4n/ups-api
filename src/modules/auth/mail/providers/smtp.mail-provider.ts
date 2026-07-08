import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailProvider } from '../interfaces/mail-provider.interface';
import { AppConfig } from '../../../../config/app.config';

@Injectable()
export class SmtpMailProvider implements MailProvider {
  private readonly logger = new Logger(SmtpMailProvider.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const appConfig = this.configService.get<AppConfig>('app', { infer: true });
    const smtpConfig = appConfig?.smtp;

    if (!smtpConfig?.host || !smtpConfig?.user || !smtpConfig?.pass) {
      throw new Error('SMTP configuration is missing or incomplete');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port ?? 587,
      secure: smtpConfig.secure ?? false,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    this.logger.log(`SMTP provider initialized with host: ${smtpConfig.host}`);
  }

  async sendOtp(email: string, code: string): Promise<void> {
    const appConfig = this.configService.get<AppConfig>('app', { infer: true });
    const smtpConfig = appConfig?.smtp;
    const appName = appConfig?.appName;

    if (!smtpConfig?.from) {
      throw new Error('SMTP_FROM configuration is missing');
    }

    await this.transporter.sendMail({
      from: `"${appName}" <${smtpConfig.from}>`,
      to: email,
      subject: 'Codigo de verificacion UPS ExpresosApp',
      text: `Tu codigo de verificacion es: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>UPS ExpresosApp</h2>
          <p>Tu codigo de verificacion es:</p>
          <h1 style="color: #0066cc; letter-spacing: 5px;">${code}</h1>
          <p>Este codigo expira en 10 minutos.</p>
          <p>Si no solicitaste este codigo, ignora este mensaje.</p>
        </div>
      `,
    });
  }
}
