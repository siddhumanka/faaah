export interface Friend {
  id: string;
  name: string;
  emoji: string;
  addedAt: string;
}

export interface FaaahEvent {
  id: string;
  type: 'sent' | 'received';
  friendId: string;
  friendName: string;
  timestamp: string;
}

export interface DailyState {
  date: string;
  remaining: number;
  sent: string[]; // friendIds sent to today
}

const FRIENDS_KEY = 'faaah-friends';
const EVENTS_KEY = 'faaah-events';
const DAILY_KEY = 'faaah-daily';
const ONBOARDED_KEY = 'faaah-onboarded';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getFriends(): Friend[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(FRIENDS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFriends(friends: Friend[]) {
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
}

export function addFriend(name: string, emoji: string): Friend {
  const friends = getFriends();
  const friend: Friend = {
    id: crypto.randomUUID(),
    name,
    emoji,
    addedAt: new Date().toISOString(),
  };
  friends.push(friend);
  saveFriends(friends);
  return friend;
}

export function removeFriend(id: string) {
  const friends = getFriends().filter((f) => f.id !== id);
  saveFriends(friends);
}

export function getEvents(): FaaahEvent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(EVENTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveEvents(events: FaaahEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addEvent(event: Omit<FaaahEvent, 'id'>): FaaahEvent {
  const events = getEvents();
  const full: FaaahEvent = { ...event, id: crypto.randomUUID() };
  events.unshift(full);
  // Keep last 200 events
  if (events.length > 200) events.length = 200;
  saveEvents(events);
  return full;
}

export function getDailyState(): DailyState {
  if (typeof window === 'undefined') return { date: getToday(), remaining: 5, sent: [] };
  const data = localStorage.getItem(DAILY_KEY);
  if (data) {
    const state: DailyState = JSON.parse(data);
    // Reset if it's a new day
    if (state.date !== getToday()) {
      const fresh: DailyState = { date: getToday(), remaining: 5, sent: [] };
      localStorage.setItem(DAILY_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return state;
  }
  const fresh: DailyState = { date: getToday(), remaining: 5, sent: [] };
  localStorage.setItem(DAILY_KEY, JSON.stringify(fresh));
  return fresh;
}

export function sendFaaah(friendId: string): DailyState | null {
  const state = getDailyState();
  if (state.remaining <= 0) return null;
  state.remaining -= 1;
  state.sent.push(friendId);
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
  return state;
}

export function getOnboarded(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function setOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, 'true');
}

export function getStats() {
  const events = getEvents();
  const sent = events.filter((e) => e.type === 'sent');
  const received = events.filter((e) => e.type === 'received');
  const today = getToday();
  const todaySent = sent.filter((e) => e.timestamp.startsWith(today));
  const todayReceived = received.filter((e) => e.timestamp.startsWith(today));

  return {
    totalSent: sent.length,
    totalReceived: received.length,
    todaySent: todaySent.length,
    todayReceived: todayReceived.length,
  };
}
