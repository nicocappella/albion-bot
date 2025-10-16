import { Injectable } from '@nestjs/common';

export interface MemberSnapshot {
  ingameName: string;
  role?: string;
  combatPower?: number;
}

export interface MembersSummary {
  totalMembers: number;
  sample: MemberSnapshot[];
  lastSync: Date | null;
}

@Injectable()
export class MembersService {
  private roster: MemberSnapshot[] = [];
  private lastSync: Date | null = null;

  getSummary(limit = 5): MembersSummary {
    return {
      totalMembers: this.roster.length,
      sample: this.roster.slice(0, limit),
      lastSync: this.lastSync,
    };
  }

  // Temporary method until persistence is wired
  seedRoster(roster: MemberSnapshot[]): void {
    this.roster = roster;
    this.lastSync = new Date();
  }
}
