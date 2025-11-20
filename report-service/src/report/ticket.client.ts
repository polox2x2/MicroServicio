import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketClient {
  private ticketServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ticketServiceUrl = this.configService.get<string>('TICKET_SERVICE_URL') || 'http://localhost:8081/api/tickets';
  }

  async getTicketsByDateRange(start: string, end: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ticketServiceUrl}/report-data`, {
          params: { start, end },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
  }
}
