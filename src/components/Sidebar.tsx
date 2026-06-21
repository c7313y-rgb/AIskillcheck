import type { ReactElement } from "react";
import sidebarImage480 from "../assets/sidebar-career-480.webp";
import sidebarImage960 from "../assets/sidebar-career-960.webp";
import sidebarImage1600 from "../assets/sidebar-career-1600.webp";
import sidebarImageFallback from "../assets/sidebar-career.webp";

interface NavItem {
  href: string;
  label: string;
  icon: ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "#home",
    label: "ホーム",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "#diagnosis",
    label: "診断をはじめる",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 3 1.9 4.4L18 9.3l-4.1 1.8L12 15.5l-1.9-4.4L6 9.3l4.1-1.9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M19 14.5 20 17l2.5 1-2.5 1-1 2.5-1-2.5L16 18l2.5-1 1-2.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "#result",
    label: "診断結果",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: "#skillmap",
    label: "スキルマップ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 18v-5m5 5V7m5 11v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "#courses",
    label: "おすすめ講座",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 5h11a3 3 0 0 1 3 3v11H8a3 3 0 0 0-3 3V5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M8 8h8m-8 4h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "#plan",
    label: "レポート出力",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 3h8l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M16 3v5h5M10 12h6m-6 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "#career",
    label: "AIキャリア診断",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 18h12M7 18V9h10v9M10 9V6h4v3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path
          d="m9 14 2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "#settings",
    label: "設定",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 3 1.3 2.55 2.86.44.87 2.77 2.42 1.58-.86 2.77 1.02 2.7-1.98 2.1-2.76-.43L12 21l-2.55-1.28-2.77.43-1.98-2.1 1.02-2.7-.86-2.77 2.42-1.58.87-2.77 2.86-.44L12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
];

interface SidebarProps {
  activeSection: string;
  onGatedNavigate: (sectionId: string) => void;
  hasResult: boolean;
}

const GATED_SECTION_IDS = new Set(["result", "courses", "plan", "career"]);

export function Sidebar({ activeSection, onGatedNavigate, hasResult }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="メインメニュー">
      <a className="side-brand" href="#home" aria-label="AIスキル診断トップへ">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <path
              d="M24 6c-8.837 0-16 7.163-16 16 0 7.119 4.651 13.152 11.08 15.237.42.136.92-.156.92-.598v-4.188c-2.547.553-4.03-.845-4.74-2.1-.4-.709-1.062-1.45-1.8-1.846-.607-.325-.737-.799-.013-.812 1.352-.026 2.316 1.248 2.638 1.768 1.547 2.596 4.023 1.866 5.018 1.42.158-1.118.605-1.88 1.1-2.313-4.516-.511-9.24-2.258-9.24-10.025 0-2.212.79-4.035 2.086-5.456-.21-.512-.907-2.57.197-5.354 0 0 1.707-.546 5.6 2.083A19.563 19.563 0 0 1 24 11.4c1.738.008 3.478.236 5.108.69 3.894-2.642 5.602-2.096 5.602-2.096 1.104 2.784.406 4.842.197 5.354 1.296 1.421 2.086 3.244 2.086 5.456 0 7.786-4.737 9.507-9.253 10.012.697.603 1.32 1.775 1.32 3.59v2.233c0 .443.5.742.922.598C35.349 35.152 40 29.119 40 22 40 13.163 32.837 6 24 6Z"
              fill="currentColor"
            />
            <path d="M18 18h3v3h-3zm9 0h3v3h-3zm-4.5 6.5h3v6h-3z" fill="#081a37" />
          </svg>
        </span>
        <span>
          <b>AIスキル診断</b>
          <small>Powered by DX Standards</small>
        </span>
      </a>

      <nav className="side-nav" aria-label="セクションナビゲーション">
        {NAV_ITEMS.map((item) => {
          const sectionId = item.href.replace("#", "");
          const isActive = activeSection === sectionId;
          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "true" : undefined}
              onClick={(event) => {
                if (GATED_SECTION_IDS.has(sectionId) && !hasResult) {
                  event.preventDefault();
                  onGatedNavigate(sectionId);
                }
              }}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="side-promo">
        <b>
          スキルを磨いて
          <br />
          未来のキャリアを
          <br />
          切り拓こう！
        </b>
        <p>あなたの可能性は、AIと共に無限に広がる。</p>
        <a href="#career">詳しく見る</a>
        <img
          src={sidebarImageFallback}
          srcSet={`${sidebarImage480} 480w, ${sidebarImage960} 960w, ${sidebarImage1600} 1600w`}
          sizes="260px"
          loading="lazy"
          width={260}
          height={190}
          alt="AI時代のキャリア成長イメージ"
        />
      </div>
    </aside>
  );
}
