import Link from 'next/link'
import {useRouter} from 'next/router'
import {Button} from '@/components/Button'
import {navigation} from '@/components/Navigation'
import {PiInstagramLogo, PiTelegramLogo, PiWhatsappLogo, PiYoutubeLogo} from "react-icons/pi";


function PageLink({label, page, previous = false}) {
    return (
        <>
            <Button
                href={page.href}
                aria-label={`${label}: ${page.title}`}
                variant="secondary"
                arrow={previous ? 'left' : 'right'}
            >
                {label}
            </Button>
            <Link
                href={page.href}
                tabIndex={-1}
                aria-hidden="true"
                className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
            >
                {page.title}
            </Link>
        </>
    )
}

function PageNavigation() {
    let router = useRouter()
    let allPages = navigation.flatMap((group) => group.links)
    let currentPageIndex = allPages.findIndex(
        (page) => page.href === router.pathname
    )

    if (currentPageIndex === -1) {
        return null
    }

    let previousPage = allPages[currentPageIndex - 1]
    let nextPage = allPages[currentPageIndex + 1]

    if (!previousPage && !nextPage) {
        return null
    }

    return (
        <div className="flex">
            {previousPage && (
                <div className="flex flex-col items-start gap-3">
                    <PageLink label="Previous" page={previousPage} previous/>
                </div>
            )}
            {nextPage && (
                <div className="ml-auto flex flex-col items-end gap-3">
                    <PageLink label="Next" page={nextPage}/>
                </div>
            )}
        </div>
    )
}

function SmallPrint() {
    return (
        <div
            className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                &copy; Copyright {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex gap-4">
                <Link href="/"><PiInstagramLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><PiYoutubeLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><PiTelegramLogo className="text-xl text-black dark:text-white"/></Link>
                <Link href="/"><PiWhatsappLogo className="text-xl text-black dark:text-white"/></Link>
            </div>
        </div>
    )
}

export function Footer() {
    return (
        <footer className="mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
            <PageNavigation/>
            <SmallPrint/>
        </footer>
    )
}
