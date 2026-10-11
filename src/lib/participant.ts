import { ApiError, authRequest, type AuthUser } from './auth';

export type Person = AuthUser & { firstName: string; lastName: string; email: string; festId: string | null; collegeName?: string | null; phoneNumber?: string | null };
export type EventInfo = { id: string; slug?: string; name: string; club: string; isTeamEvent: boolean; minTeamSize: number | null; maxTeamSize: number | null; price: number; paymentTrigger: string; registrationEndTime: string; venue?: string };
export type Invite = { id: number; status: string; user?: Person; email: string; createdAt: string };
export type Team = { id: number; eventId: string; name: string; teamCode: string; isLeader: boolean; event: EventInfo; leader: Person; members: (Person & { isLeader?: boolean })[]; invites: Invite[]; stats: { isReadyForRegistration: boolean; isRegistered: boolean; totalAccepted: number; pendingCount: number; minTeamSize: number; maxTeamSize: number } };
export type Registration = { id: number; eventId: string; status: string; createdAt: string; event: EventInfo; team?: { name: string }; roundProgress: { roundId: number; name: string; status: string }[] };
export type Profile = { user: Person; registeredEvents: Registration[]; teams: Team[]; stats: { totalRegisteredEvents: number; totalTeams: number; totalQualifiedRounds: number }; activities: { id: string; title: string; subtitle: string; timestamp: string }[] };
export type Notification = { id: number; senderId: string; recipientId: string; senderName: string; eventName: string; eventId: string; teamId: number; teamName: string; inviteId: number | null; kind: 'TEAM_INVITE' | 'INVITE_RESPONSE'; status: string; createdAt: string; updatedAt: string; respondedAt: string | null; readAt: string | null };
export type Inbox = { notifications: Notification[]; unreadCount: number; page: number; totalPages: number };

export async function participantRequest<T>(path: string, body?: unknown, method?: string): Promise<T> {
  const token = localStorage.getItem('tf_auth_token');
  if (!token) throw new ApiError('Please log in to continue.', 401);
  return (await authRequest(path, body, token, method)).data as T;
}
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value));
export const fullName = (user: Pick<Person, 'firstName' | 'lastName'>) => `${user.firstName} ${user.lastName || ''}`.trim();
