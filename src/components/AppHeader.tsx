import LanguagePicker from './LanguagePicker'

/**
 * Copied from design-system/components/AppHeader.tsx.
 * Requires: react-i18next.
 *
 * hideLanguagePicker: local addition — Team Identity's facilitator mode hides
 * the language switcher to reduce UI noise on a projected screen.
 */

interface NavItem {
  key: string
  label: string
  active: boolean
  onClick: () => void
}

interface AppHeaderProps {
  title: string
  onTitleClick?: () => void
  navItems?: NavItem[]
  hideLanguagePicker?: boolean
  children?: React.ReactNode
}

const DASHBOARD_URL = 'https://agile-toolkit.github.io/'

const GridIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <rect x="1" y="1" width="6" height="6" rx="1"/>
    <rect x="9" y="1" width="6" height="6" rx="1"/>
    <rect x="1" y="9" width="6" height="6" rx="1"/>
    <rect x="9" y="9" width="6" height="6" rx="1"/>
  </svg>
)

export default function AppHeader({ title, onTitleClick, navItems, hideLanguagePicker, children }: AppHeaderProps) {
  return (
    <header className="bg-[var(--glass)] backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Left: dashboard link + app title */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={DASHBOARD_URL}
            title="Agile Toolkit — back to dashboard"
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <GridIcon />
          </a>
          {onTitleClick ? (
            <button
              type="button"
              onClick={onTitleClick}
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              {title}
            </button>
          ) : (
            <span className="font-semibold text-brand-600">{title}</span>
          )}
        </div>

        {/* Right: optional nav pills + language picker + children slot */}
        <div className="flex items-center gap-1 min-w-0">
          {navItems && navItems.length > 0 && (
            <nav className="flex items-center gap-0.5 mr-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    item.active
                      ? 'bg-brand-50 dark:bg-brand-700/20 text-brand-700 dark:text-brand-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {!hideLanguagePicker && <LanguagePicker />}

          {children}
        </div>

      </div>
    </header>
  )
}
