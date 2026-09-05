import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import AppHeader from '../AppHeader'
import ThemeToggle from '../ThemeToggle'

interface LearnScreenProps {
  onClose: () => void
  facilitatorMode: boolean
  facilitatorBtn: ReactNode
}

export default function LearnScreen({ onClose, facilitatorMode, facilitatorBtn }: LearnScreenProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col" data-accent="amber">
      <AppHeader
        title={t('app.title')}
        onTitleClick={onClose}
        hideLanguagePicker={facilitatorMode}
        navItems={facilitatorMode ? [] : [{ key: 'learn', label: t('learn.title'), active: true, onClick: () => {} }]}
      >
        <ThemeToggle />
        {facilitatorBtn}
      </AppHeader>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">{t('learn.title')}</h1>
        <div className="card">
          <h2 className="font-semibold mb-2">{t('learn.why_title')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('learn.why_body')}</p>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">{t('learn.expo_title')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('learn.expo_body')}</p>
        </div>
      </main>
    </div>
  )
}
