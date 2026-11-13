export type EventCategory = 
  | 'all' 
  | 'performance' // 공연 (뮤지컬, 콘서트, 연극)
  | 'movie'       // 영화 (독립영화, GV, 기획전)
  | 'exhibition'  // 전시 (미디어아트, 미술, 사진전)
  | 'popup'       // 팝업스토어 (브랜드, 캐릭터 팝업)
  | 'collab_cafe' // 콜라보카페 (애니, 게임 테마 카페)
  | 'festival';   // 축제 (페스티벌, 야외 축제)

export interface CultureEvent {
  id: number;
  ranking?: number;
  title: string;
  category: EventCategory;
  categoryName: string;
  location: string;
  spot: string;
  date: string;
  price: string;
  priceNum: number;
  dDay: string;
  dDayBg: string;
  dDayText: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  desc: string;
  imageUrl: string;
  waitingCount?: number;
  bookingType: 'seat' | 'slot' | 'raffle' | 'free';
  likes: string;
  viewCount: string;
  tags: string[];
  cast?: string;
  runningTime?: string;
  hasSeating?: boolean;
  isTicketingImminent?: boolean;
  ticketingTime?: string;
  openCountdownSeconds?: number;
}

export type SeatGrade = 'vip' | 'r' | 's' | 'empty';

export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending';
export type UserRole = 'user' | 'organizer' | 'admin';

export interface AdminMember {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  suspensionUntil?: string;
  banReason?: string;
  warningCount: number;
  createdAt: string;
  lastLoginAt: string;
  lastLoginIp: string;
  totalBookings: number;
  totalSpent: number;
  points: number;
  passVerified: boolean;
  memo?: string;
  recentActionLog?: { date: string; action: string; adminName: string }[];
}

export interface SeatInfo {
  id: string;
  row: string;
  col: number;
  grade: SeatGrade;
  price: number;
  selectedBy?: 'host' | 'guest' | null;
  isSold?: boolean;
}

export interface PopCourse {
  title: string;
  region: string;
  totalTime: string;
  spots: {
    step: number;
    title: string;
    category: string;
    sub: string;
    image: string;
  }[];
}

export interface WrappedRecipe {
  userName: string;
  title: string;
  totalVisits: number;
  topPercent: number;
  savedEarlyBird: number;
  stampsCollected: number;
  topHotspots: { name: string; percent: number }[];
  tasteComposition: { name: string; percent: number; color: string }[];
}

export interface SpecScreenItem {
  part: string;
  no: string;
  name: string;
  url: string;
  role: string;
  kind: 'core' | 'ext' | 'mix' | 'add';
  feats: [string, string][];
  note?: string;
}
