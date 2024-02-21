import {createContext, Fragment, useContext} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {motion} from 'framer-motion'
import {create} from 'zustand'

import {Header} from '@/components/Header'
import {Navigation} from '@/components/Navigation'
import {HiMenu} from "react-icons/hi";
import {IoClose} from "react-icons/io5";

function MenuIcon(props) {
    return (
        <HiMenu className="text-xl text-white"/>
    )
}

function XIcon(props) {
    return (
        <IoClose className="text-xl text-white"/>
    )
}

const IsInsideMobileNavigationContext = createContext(false)

export function useIsInsideMobileNavigation() {
    return useContext(IsInsideMobileNavigationContext)
}

export const useMobileNavigationStore = create((set) => ({
    isOpen: false,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false}),
    toggle: () => set((state) => ({isOpen: !state.isOpen})),
}))

export function MobileNavigation() {
    let isInsideMobileNavigation = useIsInsideMobileNavigation()
    let {isOpen, toggle, close} = useMobileNavigationStore()
    let ToggleIcon = isOpen ? XIcon : MenuIcon

    return (
        <IsInsideMobileNavigationContext.Provider value={true}>
            <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 bg-red-600"
                aria-label="Toggle navigation"
                onClick={toggle}
            >
                <ToggleIcon className="w-2.5 stroke-zinc-900 dark:stroke-white"/>
            </button>
            {!isInsideMobileNavigation && (
                <Transition.Root show={isOpen} as={Fragment}>
                    <Dialog onClose={close} className="fixed inset-0 z-50 lg:hidden">
                        <Transition.Child
                            as={Fragment}
                            enter="duration-300 ease-out"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="duration-200 ease-in"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-sm dark:bg-black/40"/>
                        </Transition.Child>

                        <Dialog.Panel>
                            <Transition.Child
                                as={Fragment}
                                enter="duration-500 ease-out"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="duration-200 ease-in"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Header/>
                            </Transition.Child>

                            <Transition.Child
                                as={Fragment}
                                enter="duration-500 ease-in-out"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="duration-500 ease-in-out"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <motion.div
                                    layoutScroll
                                    className="fixed bottom-0 left-0 top-14 w-full overflow-y-auto bg-white px-4 pb-4 pt-6 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 min-[416px]:max-w-sm sm:px-6 sm:pb-10"
                                >
                                    <Navigation/>
                                </motion.div>
                            </Transition.Child>
                        </Dialog.Panel>
                    </Dialog>
                </Transition.Root>
            )}
        </IsInsideMobileNavigationContext.Provider>
    )
}
