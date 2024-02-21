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
import {TbLayoutGrid} from "react-icons/tb";
import {PiInstagramLogo, PiYoutubeLogo, PiTelegramLogo, PiWhatsappLogo} from "react-icons/pi";
import {FiGithub} from "react-icons/fi";
import {LuMail} from "react-icons/lu";
import TypeIt from "typeit-react";

export const Header = forwardRef(function Header({className}, ref) {
    let {isOpen: mobileNavIsOpen} = useMobileNavigationStore()
    let isInsideMobileNavigation = useIsInsideMobileNavigation()

    let {scrollY} = useScroll()
    let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
    let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

    return (<motion.div
        ref={ref}
        className={clsx(className, ' fixed inset-x-0 top-0 z-50 flex h-14 items-center b0' + ' justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80', !isInsideMobileNavigation && 'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80', isInsideMobileNavigation ? 'bg-white dark:bg-zinc-900' : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]')}
        style={{
            '--bg-opacity-light': bgOpacityLight, '--bg-opacity-dark': bgOpacityDark,
        }}
    >
        <div
            className={clsx('absolute inset-x-0 top-full h-px transition', (isInsideMobileNavigation || !mobileNavIsOpen) && 'bg-zinc-900/7.5 dark:bg-white/7.5')}
        />
        <div className="inline-block lg:hidden">
            <MobileNavigation/>
        </div>
        <div className="hidden lg:flex items-center gap-x-2 font-semibold text-black dark:text-white">
            <TbLayoutGrid className="text-2xl cursor-pointer"/>
            <h1 className="">
                <TypeIt
                    options={{
                        strings: ["Web Development in 2024"],
                        speed: 300,
                        loop: true,
                        startDelay:300,
                        loopDelay: 300,
                        cursorChar: ""
                    }}
                />

            </h1>
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
            <div className="hidden xl:block md:h-5 md:w-px md:bg-zinc-900/50 md:dark:bg-white/15"/>
            <div className="hidden xl:flex items-center gap-4">
                <Link href="/"><PiInstagramLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><PiYoutubeLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><PiTelegramLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><PiWhatsappLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><FiGithub className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><LuMail className="text-xl text-black dark:text-white"/></Link>
            </div>
            <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/50 md:dark:bg-white/15"/>
            <div className="hidden md:inline-block">
                <Link to="/" className="bg-red-600 px-4 py-2 text-white rounded font-semibold" href="#">Visit
                    RedMaster</Link>
            </div>
        </div>
    </motion.div>)
})
