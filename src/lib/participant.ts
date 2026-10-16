import { ApiError, authRequest, type AuthUser } from './auth';
import type { PaymentState } from './payments';
import { hasSessionHint } from './session';

export type Person = AuthUser & { firstName: string; lastName: string; email: string; festId: string | null; collegeName?: string | null; phoneNumber?: string | null; verified?: boolean };
export type EventInfo = { id: string; slug?: string; name: string; club: string; isTeamEvent: boolean; minTeamSize: number | null; maxTeamSize: number | null; price: number; feeMode?: 'per_team' | 'per_participant'; paymentTrigger: string; paymentRound?: string; registrationEndTime: string; venue?: string };
export type Invite = { id: number; status: string; user?: Person; email: string; createdAt: string };
export type Team = { id: number; eventId: string; name: string; teamCode: string; isLeader: boolean; event: EventInfo; leader: Person; members: (Person & { isLeader?: boolean })[]; invites: Invite[]; stats: { isReadyForRegistration: boolean; isRegistered: boolean; rosterLocked: boolean; totalAccepted: number; pendingCount: number; minTeamSize: number; maxTeamSize: number } };
export type RoundProgress = { roundId: number; roundNumber: number; name: string; roundEndTime: string; status: 'QUALIFIED' | 'ELIMINATED' | 'PENDING'; notes: string | null; decidedAt: string | null };
export type Registration = { id: number; eventId: string; userId: string | null; teamId: number | null; status: string; metadata?: { theme?: string; themes?: string[]; [key: string]: unknown } | null; createdAt: string; event: EventInfo; team?: { id: number; name: string; leaderId: string }; isQualified: boolean; isRejected: boolean; roundProgress: RoundProgress[]; payment: PaymentState | null };
export type Profile = { user: Person; registeredEvents: Registration[]; teams: Team[]; stats: { totalRegisteredEvents: number; totalTeams: number; totalQualifiedRounds: number }; activities: { id: string; title: string; subtitle: string; timestamp: string }[] };
export type Notification = { id: number; senderId: string; recipientId: string; senderName: string; eventName: string; eventId: string; teamId: number | null; teamName: string | null; roundId: number | null; message: string | null; inviteId: number | null; kind: 'TEAM_INVITE' | 'INVITE_RESPONSE' | 'ROUND_PROMOTION'; status: string; createdAt: string; updatedAt: string; respondedAt: string | null; readAt: string | null };
export type MealPass = { mealId: number; typeOfMeal: 'meal' | 'snack'; slot: number; label: string | null; name: string; date: string; startTime: string | null; endTime: string | null; status: 'AVAILABLE' | 'CLAIMED'; scannedAt: string | null; personalPassToken: string; passCode: string; isServingNow: boolean; grantedByEvents: { id: string; name: string }[] };
export type Inbox = { notifications: Notification[]; unreadCount: number; page: number; totalPages: number };

export async function participantRequest<T>(path: string, body?: unknown, method?: string): Promise<T> {
  // Fail fast on a device that has never signed in, so a logged-out visitor
  // gets a clear message instead of a round-trip that 401s.
  if (!hasSessionHint()) throw new ApiError('Please log in to continue.', 401);
  return (await authRequest(path, body, undefined, method)).data as T;
}
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value));
export const fullName = (user: Pick<Person, 'firstName' | 'lastName'>) => `${user.firstName} ${user.lastName || ''}`.trim();
