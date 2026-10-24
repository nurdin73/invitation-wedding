import { describe, expect, it } from 'bun:test';
import { RsvpServiceImplement } from './rsvp.service.implement';
import type { IRsvpRepository, RsvpStats } from '../../outbound/rsvp-repository.port';
import type { IInvitationRepository, InvitationRecord } from '../../outbound/invitation-repository.port';
import type { NewRsvp, Rsvp } from '../../db/schema/rsvps.schema';

class MockRsvpRepo implements IRsvpRepository {
  public items: Rsvp[] = [];

  async create(data: NewRsvp): Promise<Rsvp> {
    const item: Rsvp = {
      id: `rsvp-${Date.now()}`,
      invitationId: data.invitationId,
      guestName: data.guestName,
      attendanceStatus: data.attendanceStatus,
      guestCount: data.guestCount ?? 1,
      message: data.message ?? null,
      createdAt: new Date(),
    };
    this.items.unshift(item);
    return item;
  }

  async findByInvitationId(invitationId: string): Promise<Rsvp[]> {
    return this.items.filter((i) => i.invitationId === invitationId);
  }

  async getStatsByInvitationId(invitationId: string): Promise<RsvpStats> {
    const list = this.items.filter((i) => i.invitationId === invitationId);
    const attending = list.filter((i) => i.attendanceStatus === 'attending').length;
    return {
      total: list.length,
      attending,
      notAttending: list.length - attending,
    };
  }
}

class MockInvitationRepo implements Partial<IInvitationRepository> {
  async findById(id: string): Promise<InvitationRecord | null> {
    if (id === 'valid-id') {
      return {
        id: 'valid-id',
        userId: 'user-1',
        slug: 'test-slug',
        title: 'Test Wedding',
        themeConfig: {},
        content: {},
        sections: [],
        isPublished: true,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }
}

describe('RsvpServiceImplement', () => {
  it('throws 404 when invitation is not found', async () => {
    const service = new RsvpServiceImplement(
      new MockRsvpRepo(),
      new MockInvitationRepo() as IInvitationRepository
    );

    await expect(
      service.submitRsvp('nonexistent', {
        guestName: 'Budi',
        attendanceStatus: 'attending',
      })
    ).rejects.toThrow('Undangan pernikahan tidak ditemukan.');
  });

  it('throws 400 when guestName is empty', async () => {
    const service = new RsvpServiceImplement(
      new MockRsvpRepo(),
      new MockInvitationRepo() as IInvitationRepository
    );

    await expect(
      service.submitRsvp('valid-id', {
        guestName: '   ',
        attendanceStatus: 'attending',
      })
    ).rejects.toThrow('Nama tamu wajib diisi.');
  });

  it('successfully creates an RSVP and returns list with stats', async () => {
    const rsvpRepo = new MockRsvpRepo();
    const service = new RsvpServiceImplement(
      rsvpRepo,
      new MockInvitationRepo() as IInvitationRepository
    );

    const created = await service.submitRsvp('valid-id', {
      guestName: 'Ahmad Subarjo',
      attendanceStatus: 'attending',
      message: 'Selamat menempuh hidup baru!',
    });

    expect(created.guestName).toBe('Ahmad Subarjo');
    expect(created.attendanceStatus).toBe('attending');
    expect(created.message).toBe('Selamat menempuh hidup baru!');

    const result = await service.getRsvps('valid-id');
    expect(result.stats.total).toBe(1);
    expect(result.stats.attending).toBe(1);
    expect(result.stats.notAttending).toBe(0);
    expect(result.rsvps.length).toBe(1);
    expect(result.rsvps[0].guestName).toBe('Ahmad Subarjo');
  });
});
