import { Injectable } from '@nestjs/common';
import { TicketClient } from './ticket.client';

@Injectable()
export class ReportService {
  constructor(private readonly ticketClient: TicketClient) { }

  async getTicketSummary(start: string, end: string) {
    const tickets = await this.ticketClient.getTicketsByDateRange(start, end);

    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => t.estado === 'resolved' || t.estado === 'closed').length;
    const openTickets = totalTickets - resolvedTickets;

    // Calculate average response time (if resolved_at exists)
    let totalResponseTime = 0;
    let resolvedCountWithTime = 0;

    tickets.forEach(t => {
      if (t.fechaResolucion && t.fechaCreacion) {
        const created = new Date(t.fechaCreacion).getTime();
        const resolved = new Date(t.fechaResolucion).getTime();
        totalResponseTime += (resolved - created);
        resolvedCountWithTime++;
      }
    });

    const avgResponseTimeHours = resolvedCountWithTime > 0
      ? (totalResponseTime / resolvedCountWithTime) / (1000 * 60 * 60)
      : 0;

    return {
      totalTickets,
      resolvedTickets,
      openTickets,
      avgResponseTimeHours: parseFloat(avgResponseTimeHours.toFixed(2)),
      period: { start, end }
    };
  }

  async getAdvisorPerformance(start: string, end: string) {
    const tickets = await this.ticketClient.getTicketsByDateRange(start, end);
    const advisorStats = {};

    tickets.forEach(t => {
      if (t.advisorId) {
        if (!advisorStats[t.advisorId]) {
          advisorStats[t.advisorId] = { assigned: 0, resolved: 0 };
        }
        advisorStats[t.advisorId].assigned++;
        if (t.estado === 'resolved' || t.estado === 'closed') {
          advisorStats[t.advisorId].resolved++;
        }
      }
    });

    return Object.keys(advisorStats).map(advisorId => ({
      advisorId: parseInt(advisorId),
      ...advisorStats[advisorId],
      resolutionRate: advisorStats[advisorId].assigned > 0
        ? (advisorStats[advisorId].resolved / advisorStats[advisorId].assigned * 100).toFixed(2) + '%'
        : '0%'
    }));
  }

  async exportReport(start: string, end: string) {
    const summary = await this.getTicketSummary(start, end);
    const header = 'Total Tickets,Resolved Tickets,Open Tickets,Avg Response Time (Hours)\n';
    const row = `${summary.totalTickets},${summary.resolvedTickets},${summary.openTickets},${summary.avgResponseTimeHours}`;
    return header + row;
  }
}
