import Link from 'next/link'
import {useRouter} from 'next/router'
import {Button} from '@/components/Button'
import {navigation} from '@/components/Navigation'
import {PiInstagramLogo, PiTelegramLogo, PiWhatsappLogo, PiYoutubeLogo} from "react-icons/pi";
import {FaMailchimp} from "react-icons/fa";
import {PiCopyrightBold} from "react-icons/pi";

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
            <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <PiCopyrightBold className="text-2xl"/>
                <p>Copyright {new Date().toDateString()}. All rights reserved.</p>
            </div>

            <div className="flex gap-4">
                <ul className="flex items-center">
                    <li className="group iconFooter  hover:bg-[#1877F2] hover:text-white">
                        <span className="tooltipSocial group-hover:bg-[#1877F2] group-hover:text-white before:bg-[#1877F2]">Facebook</span>
                        <span><PiWhatsappLogo className="text-2xl" /></span>
                    </li>
                    <li className="group iconFooter hover:bg-[#1DA1F2] hover:text-white">
                        <span className="tooltipSocial group-hover:bg-[#1DA1F2] group-hover:text-white before:bg-[#1DA1F2]">Twitter</span>
                        <span><PiTelegramLogo className="text-2xl" /></span>
                    </li>
                    <li className="group iconFooter hover:bg-[#E4405F] hover:text-white">
                        <span className="tooltipSocial group-hover:bg-[#E4405F] group-hover:text-white before:bg-[#E4405F]">Instagram</span>
                        <span><PiInstagramLogo className="text-2xl" /></span>
                    </li>
                    <li className="group iconFooter hover:bg-[#333333] hover:text-white">
                        <span className="tooltipSocial group-hover:bg-[#333333] group-hover:text-white before:bg-[#333333]">Github</span>
                        <span><PiYoutubeLogo className="text-2xl" /></span>
                    </li>
                    <li className="group iconFooter hover:bg-[#CD201F] hover:text-white">
                        <span className="tooltipSocial group-hover:bg-[#CD201F] group-hover:text-white before:bg-[#CD201F]">Youtube</span>
                        <span><PiYoutubeLogo className="text-2xl" /></span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

function FeedBack() {
    return (
        <form
            action="/thank-you"
            className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
        >
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <FaMailchimp className="text-4xl dark:text-white text-zinc-900"/>
                <span className="ml-4 font-semibold">Stay up to date</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Get notified when I publish something new, and unsubscribe at any time.
            </p>
            <div className="mt-6 flex gap-4">
                <input
                    type="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    required
                    className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
                />
                <button type="submit"
                        className='rounded bg-zinc-900  py-1 px-3 text-white hover:bg-red-700 dark:bg-zinc-400/10 dark:text-red-400 dark:ring-1 dark:ring-inset dark:ring-red-400/20 dark:hover:bg-red-400/10 dark:hover:text-red-300 dark:hover:ring-red-300'>
                    send the Email
                </button>
            </div>
        </form>
    )
}

export function Footer() {
    return (
        <footer className="mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
            <PageNavigation/>
            <FeedBack/>
            <SmallPrint/>
        </footer>
    )
}
