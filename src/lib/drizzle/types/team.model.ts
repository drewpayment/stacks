import type { SelectOptionType } from 'flowbite-svelte';
import type { SelectEmployee, SelectTeam } from '../postgres/db.model';


export interface TeamManager {
  employeeId: string;
  positionDescription: string; // owner, manager, co-owner, etc
  notes: string;
}

export interface Team extends Omit<SelectTeam, 'generalManager' | 'regionalManager'> {
  generalManager: Partial<SelectEmployee>;
  regionalManager: Partial<SelectEmployee>;
  teamMembers: SelectOptionType<string>[];
}