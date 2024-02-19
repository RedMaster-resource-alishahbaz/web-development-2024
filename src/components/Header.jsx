import {forwardRef} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import {motion, useScroll, useTransform} from 'framer-motion'
import {Logo} from '@/components/Logo'
import {
    MobileNavigation, useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import {useMobileNavigationStore} from '@/components/MobileNavigation'
import {ModeToggle} from '@/components/ModeToggle'
import {Search} from '@/components/Search'

import {PiInstagramLogo, PiYoutubeLogo, PiTelegramLogo, PiWhatsappLogo} from "react-icons/pi";

export const Header = forwardRef(function Header({className}, ref) {
    let {isOpen: mobileNavIsOpen} = useMobileNavigationStore()
    let isInsideMobileNavigation = useIsInsideMobileNavigation()

    let {scrollY} = useScroll()
    let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
    let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

    return (
        <motion.div
            ref={ref}
            className={clsx(className, ' fixed inset-x-0 top-0 z-50 flex h-14 items-center b0' +
                ' justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80', !isInsideMobileNavigation && 'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80', isInsideMobileNavigation ? 'bg-white dark:bg-zinc-900' : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]')}
            style={{
                '--bg-opacity-light': bgOpacityLight, '--bg-opacity-dark': bgOpacityDark,
            }}
        >
            <div
                className={clsx('absolute inset-x-0 top-full h-px transition', (isInsideMobileNavigation || !mobileNavIsOpen) && 'bg-zinc-900/7.5 dark:bg-white/7.5')}
            />
            <h1 className="text-black dark:text-white font-semibold hidden lg:inline-block">
                Web Development in 2024
            </h1>
            <div className="inline-block lg:hidden">
                <MobileNavigation/>
            </div>
            <div className="flex items-center gap-5 lg:hidden">
                <Link href="/" aria-label="Home">
                    <Logo className="h-6"/>
                </Link>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex gap-4">
                    <ModeToggle/>
                    <Search/>
                </div>
                <div className="hidden xl:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"/>
                <div className="hidden xl:flex items-center gap-4">
                    <Link href="/"><PiInstagramLogo className="text-xl text-black dark:text-white"/></Link>
                    <Link href="/"><PiYoutubeLogo className="text-xl text-black dark:text-white"/></Link>
                    <Link href="/"><PiTelegramLogo className="text-xl text-black dark:text-white"/></Link>
                    <Link href="/"><PiWhatsappLogo className="text-xl text-black dark:text-white"/></Link>
                </div>
                <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"/>
                <div className="hidden md:inline-block">
                    <Link to="/" className="rounded bg-red-900 py-1 px-3 text-white hover:bg-red-700 dark:bg-red-400/10' +
      ' dark:text-white dark:ring-1 dark:ring-inset dark:ring-red-400/20 dark:hover:bg-red-400/10' +
      ' dark:hover:text-red-300 dark:hover:ring-red-300" href="#">Visit RedMaster</Link>
                </div>
            </div>
        </motion.div>)
})
