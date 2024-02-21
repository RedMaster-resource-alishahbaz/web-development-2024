import {forwardRef, Fragment, useEffect, useId, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import {createAutocomplete} from '@algolia/autocomplete-core'
import {Dialog, Transition} from '@headlessui/react'
import clsx from 'clsx'
import {navigation} from '@/components/Navigation'
import Highlighter from 'react-highlight-words'
import {ImSearch} from "react-icons/im";
import {HiOutlineEmojiSad} from "react-icons/hi";
import {Button} from "@/components/Button";
import {FiSearch} from "react-icons/fi";

function useAutocomplete() {
    let id = useId()
    let router = useRouter()
    let [autocompleteState, setAutocompleteState] = useState({})

    let [autocomplete] = useState(() => createAutocomplete({
        id, placeholder: 'what are you looking for??...', defaultActiveItemId: 0, onStateChange({state}) {
            setAutocompleteState(state)
        }, shouldPanelOpen({state}) {
            return state.query !== ''
        }, getSources({query}) {
            return import('@/mdx/search.mjs').then(({search}) => {
                return [{
                    sourceId: 'documentation', getItems() {
                        return search(query, {limit: 5})
                    }, getItemUrl({item}) {
                        return item.url
                    }, onSelect({itemUrl}) {
                        router.push(itemUrl)
                    },
                },]
            })
        },
    }))

    return {autocomplete, autocompleteState}
}


function LoadingIcon(props) {
    let id = useId()

    return (<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
        <circle cx="10" cy="10" r="5.5" strokeLinejoin="round"/>
        <path
            stroke={`url(#${id})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
        />
        <defs>
            <linearGradient
                id={id}
                x1="13"
                x2="9.5"
                y1="9"
                y2="15"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="currentColor"/>
                <stop offset="1" stopColor="currentColor" stopOpacity="0"/>
            </linearGradient>
        </defs>
    </svg>)
}

function HighlightQuery({text, query}) {
    return (<Highlighter
        highlightClassName="underline bg-transparent text-red-500 font-semibold text-lg"
        searchWords={[query]}
        autoEscape={true}
        textToHighlight={text}
    />)
}

function SearchResult({result, resultIndex, autocomplete, collection, query,}) {
    let id = useId()

    let sectionTitle = navigation.find((section) => section.links.find((link) => link.href === result.url.split('#')[0]))?.title
    let hierarchy = [sectionTitle, result.pageTitle].filter(Boolean)

    return (<li
        className={clsx('group block cursor-default px-4 py-3 aria-selected:bg-zinc-50 dark:aria-selected:bg-zinc-800/50', resultIndex > 0 && 'border-t border-zinc-100 dark:border-zinc-800')}
        aria-labelledby={`${id}-hierarchy ${id}-title`}
        {...autocomplete.getItemProps({
            item: result, source: collection.source,
        })}
    >
        <div
            id={`${id}-title`}
            aria-hidden="true"
            className="text-sm font-medium text-zinc-900 group-aria-selected:text-red-500 dark:text-white"
        >
            <HighlightQuery text={result.title} query={query}/>
        </div>
        {hierarchy.length > 0 && (<div
            id={`${id}-hierarchy`}
            aria-hidden="true"
            className="mt-1 truncate whitespace-nowrap text-2xs text-zinc-500"
        >
            {hierarchy.map((item, itemIndex, items) => (<Fragment key={itemIndex}>
                <HighlightQuery text={item} query={query}/>
                <span
                    className={itemIndex === items.length - 1 ? 'sr-only' : 'mx-2 text-zinc-300 dark:text-zinc-700'}
                >
                /
              </span>
            </Fragment>))}
        </div>)}
    </li>)
}

function SearchResults({autocomplete, query, collection}) {
    if (collection.items.length === 0) {
        return (<div className="p-6 text-center">
            <HiOutlineEmojiSad className="mx-auto text-5xl text-zinc-900 dark:text-zinc-600"/>
            <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400 flex items-center justify-center gap-2">
                Nothing found :
                <strong className="break-words font-semibold text-zinc-900 dark:text-white">
                    &lsquo;{query}&rsquo;
                </strong>
                <Button className="block" variant="outline">Please try again</Button>
            </p>
        </div>)
    }

    return (<ul role="list" {...autocomplete.getListProps()}>
        {collection.items.map((result, resultIndex) => (<SearchResult
            key={result.url}
            result={result}
            resultIndex={resultIndex}
            autocomplete={autocomplete}
            collection={collection}
            query={query}
        />))}
    </ul>)
}

const SearchInput = forwardRef(function SearchInput({autocomplete, autocompleteState, onClose}, inputRef) {
    let inputProps = autocomplete.getInputProps({})

    return (<div className="group relative flex h-12">
        <FiSearch
            className="pointer-events-none absolute left-3 top-0 h-full text-xl text-black dark:text-white"/>
        <input
            ref={inputRef}
            className={clsx('flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none' +
                ' placeholder:mx-4 placeholder:text-zinc-500 focus:w-full focus:flex-none' +
                ' dark:text-white' +
                ' sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden', autocompleteState.status === 'stalled' ? 'pr-11' : 'pr-4')}
            {...inputProps}
            onKeyDown={(event) => {
                if (event.key === 'Escape' && !autocompleteState.isOpen && autocompleteState.query === '') {
                    // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
                    // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
                    document.activeElement?.blur()

                    onClose()
                } else {
                    inputProps.onKeyDown(event)
                }
            }}
        />
        {autocompleteState.status === 'stalled' && (
            <div className="absolute inset-y-0 right-3 flex items-center">
                <LoadingIcon
                    className="h-5 w-5 animate-spin stroke-zinc-200 text-zinc-900 dark:stroke-zinc-800 dark:text-red-400"/>
            </div>)}
    </div>)
})


function SearchDialog({open, setOpen, className}) {
    let router = useRouter()
    let formRef = useRef()
    let panelRef = useRef()
    let inputRef = useRef()
    let {autocomplete, autocompleteState} = useAutocomplete()

    useEffect(() => {
        if (!open) {
            return
        }

        function onRouteChange() {
            setOpen(false)
        }

        router.events.on('routeChangeStart', onRouteChange)
        router.events.on('hashChangeStart', onRouteChange)

        return () => {
            router.events.off('routeChangeStart', onRouteChange)
            router.events.off('hashChangeStart', onRouteChange)
        }
    }, [open, setOpen, router])

    useEffect(() => {
        if (open) {
            return
        }

        function onKeyDown(event) {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                setOpen(true)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [open, setOpen])

    return (<Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => autocomplete.setQuery('')}
    >
        <Dialog
            onClose={setOpen}
            className={clsx('fixed inset-0 z-50', className)}
        >
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-white/30"/>
            </Transition.Child>

            <div
                className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel
                        className="mx-auto overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-xl">
                        <div {...autocomplete.getRootProps({})}>
                            <form
                                ref={formRef}
                                {...autocomplete.getFormProps({
                                    inputElement: inputRef.current,
                                })}
                            >
                                <SearchInput
                                    ref={inputRef}
                                    autocomplete={autocomplete}
                                    autocompleteState={autocompleteState}
                                    onClose={() => setOpen(false)}
                                />
                                <div
                                    ref={panelRef}
                                    className="border-t border-zinc-200 bg-white empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
                                    {...autocomplete.getPanelProps({})}
                                >
                                    {autocompleteState.isOpen && (<SearchResults
                                        autocomplete={autocomplete}
                                        query={autocompleteState.query}
                                        collection={autocompleteState.collections[0]}
                                    />)}
                                </div>
                            </form>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>)
}

function useSearchProps() {
    let buttonRef = useRef()
    let [open, setOpen] = useState(false)

    return {
        buttonProps: {
            ref: buttonRef, onClick() {
                setOpen(true)
            },
        }, dialogProps: {
            open, setOpen(open) {
                let {width, height} = buttonRef.current.getBoundingClientRect()
                if (!open || (width !== 0 && height !== 0)) {
                    setOpen(open)
                }
            },
        },
    }
}

export function Search() {
    let [modifierKey, setModifierKey] = useState()
    let {buttonProps, dialogProps} = useSearchProps()

    useEffect(() => {
        setModifierKey(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl ')
    }, [])

    return (<div className="">
        <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 focus:[&:not(:focus-visible)]:outline-none"
            aria-label="Find something..."
            {...buttonProps}
        >
            <FiSearch className="text-xl text-black dark:text-white"/>
        </button>
        <SearchDialog  {...dialogProps} />
    </div>)
}

