"use client";

/**
 * Professional icon set — Lucide (consistent 1.75 stroke, 24px grid).
 * Exported under the project's existing names so nothing else has to change.
 */
import {
  Wind,
  VolumeX,
  ShieldCheck,
  Leaf,
  Zap,
  Truck,
  MessageCircle,
  Cpu,
  Users,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Play,
  Star,
  Menu,
  X,
  Trash2,
  Check,
  Lock,
  Package,
  Search,
  ChevronRight,
  Clock,
  Headphones,
  Mic,
  Square,
  Volume2,
  AlertTriangle,
  Sparkles,
  PartyPopper,
} from "lucide-react";

const make =
  (C, defaults = {}) =>
  ({ size = 22, ...props }) =>
    <C size={size} strokeWidth={1.75} absoluteStrokeWidth {...defaults} {...props} />;

export const IconWind = make(Wind);
export const IconQuiet = make(VolumeX);
export const IconShield = make(ShieldCheck);
export const IconLeaf = make(Leaf);
export const IconBolt = make(Zap);
export const IconTruck = make(Truck);
export const IconChat = make(MessageCircle);
export const IconGear = make(Cpu);
export const IconUsers = make(Users);
export const IconArrowRight = make(ArrowRight, { size: 18 });
export const IconArrowLeft = make(ArrowLeft, { size: 18 });
export const IconCart = make(ShoppingCart, { size: 20 });
export const IconPhone = make(Phone, { size: 16 });
export const IconMail = make(Mail, { size: 16 });
export const IconPin = make(MapPin, { size: 16 });
export const IconMenu = make(Menu, { size: 24 });
export const IconClose = make(X, { size: 24 });
export const IconTrash = make(Trash2, { size: 16 });
export const IconCheck = make(Check);
export const IconLock = make(Lock);
export const IconPackage = make(Package);
export const IconSearch = make(Search, { size: 18 });
export const IconChevron = make(ChevronRight, { size: 16 });

export const IconClock = make(Clock);
export const IconSupport = make(Headphones);
export const IconMic = make(Mic, { size: 18 });
export const IconStop = make(Square, { size: 16, fill: "currentColor" });
export const IconSpeaker = make(Volume2);
export const IconMute = make(VolumeX);
export const IconAlert = make(AlertTriangle);
export const IconSparkle = make(Sparkles, { size: 16 });
export const IconParty = make(PartyPopper);

/* Brand marks — Lucide intentionally ships no brand logos, so these are
   the official simple-icons paths (filled, 24px grid). */
const Brand = ({ size = 19, children, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
    {children}
  </svg>
);

export const IconFacebook = (p) => (
  <Brand {...p}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
  </Brand>
);
export const IconInstagram = (p) => (
  <Brand {...p}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm7.85-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
  </Brand>
);
export const IconTiktok = (p) => (
  <Brand {...p}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </Brand>
);
export const IconWhatsapp = (p) => (
  <Brand {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 01-1.5-5.22c0-5.4 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.88a9.74 9.74 0 012.87 6.93c0 5.4-4.4 9.81-9.8 9.81zM20.52 3.48A11.75 11.75 0 0012.05 0C5.55 0 .26 5.29.26 11.79c0 2.08.54 4.11 1.58 5.9L.16 24l6.45-1.69a11.76 11.76 0 005.44 1.39h.01c6.5 0 11.79-5.29 11.79-11.79 0-3.15-1.23-6.11-3.45-8.34z" />
  </Brand>
);

// filled icons
export const IconPlay = ({ size = 28, ...p }) => (
  <Play size={size} fill="currentColor" strokeWidth={0} {...p} />
);
export const IconStar = ({ size = 15, ...p }) => (
  <Star size={size} fill="currentColor" strokeWidth={0} {...p} />
);
