import Link from 'next/link'
import Image from 'next/image'

import { Hamburguer } from './hamburguer'

interface HeaderProps {
  hasHamburguer?: boolean
  sidebarIsVisible?: boolean
  handleSidebarVisibilityToggle?(): void
}

export function Header({
  hasHamburguer = true,
  sidebarIsVisible,
  handleSidebarVisibilityToggle,
}: HeaderProps) {
  return (
    <header className="flex h-20 w-full items-center border-b-[1px] border-[#ffffff26] bg-[#1c1d21] px-8 py-4">
      <div className="flex items-center gap-4 sm:gap-0">
        {hasHamburguer && (
          <Hamburguer
            sidebarIsVisible={sidebarIsVisible}
            handleSidebarVisibilityToggle={handleSidebarVisibilityToggle}
          />
        )}

        <Link
          href="/dashboard"
          className="relative block h-6 w-32 sm:h-12 sm:w-40"
        >
          <Image src="/images/shared/logo.svg" alt="Auto Roleta" fill />
        </Link>
      </div>
    </header>
  )
}