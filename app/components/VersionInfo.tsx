import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface VersionInfo {
  version: string
  lastUpdated: string
}

export function VersionInfo() {
  const { t } = useTranslation()
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/version')
        const data = await response.json()
        setVersionInfo(data)
      } catch (error) {
        console.error('Error fetching version:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVersion()
  }, [])

  const handleIncrementVersion = async () => {
    try {
      const response = await fetch('/api/admin/version', {
        method: 'PUT'
      })
      const data = await response.json()
      setVersionInfo(data)
    } catch (error) {
      console.error('Error incrementing version:', error)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">{t('admin.loading')}</div>
  }

  if (!versionInfo) {
    return <div className="text-sm text-red-500">{t('admin.versionError')}</div>
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>{t('admin.version')}: {versionInfo.version}</span>
      <span className="text-gray-400">|</span>
      <span>{t('admin.lastUpdated')}: {new Date(versionInfo.lastUpdated).toLocaleString()}</span>
      <button
        onClick={handleIncrementVersion}
        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {t('admin.incrementVersion')}
      </button>
    </div>
  )
} 