import Head from 'next/head'
import {Router, useRouter} from 'next/router'
import {MDXProvider} from '@mdx-js/react'

import {Layout} from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import {useMobileNavigationStore} from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'

function onRouteChange() {
    useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({Component, pageProps}) {
    let router = useRouter()

    return (
        <>
            <Head>
                {router.pathname === '/' ? (
                    <title>Web Development 2024</title>
                ) : (
                    <title>{`${pageProps.title} - Web Development 2024`}</title>
                )}
                <meta name="description" content={pageProps.description}/>
                <link rel="icon" href="/favicon.ico" sizes="any"/>
            </Head>
            <MDXProvider components={mdxComponents}>
                <Layout {...pageProps}>
                    <Component {...pageProps} />
                </Layout>
            </MDXProvider>
        </>
    )
}
