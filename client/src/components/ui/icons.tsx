import {
  ArrowRight,
  Banknote,
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  HeartHandshake,
  Laptop,
  Moon,
  Plus,
  Settings,
  SunMedium,
  User,
  UsersRound,
  X,
} from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: HeartHandshake,
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  chevleft: ChevronLeft,
  arrowRight: ArrowRight,
  settings: Settings,
  close: X,
  add: Plus,
  user: User,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  dashboard: BarChart3,
  beneficiary: UsersRound,
  loan: Banknote,
  session: CalendarCheck,
};
