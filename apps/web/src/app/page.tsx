import Link from 'next/link'
import { Hello } from '@/components/hello'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-800 to-gray-500 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          Welcome to&nbsp;
          <code className="font-mono font-bold">Fullstack Monorepo</code>
        </p>
      </div>

      <div className="relative flex place-items-center my-16">
        <h1 className="text-5xl font-bold text-center">
          Next.js + React Native + NestJS + tRPC
        </h1>
      </div>

      <div className="mb-8">
        <Hello />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <Link
          href="/web"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Web{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Next.js frontend with modern UI and great performance.
          </p>
        </Link>

        <Link
          href="/mobile"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Mobile{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            React Native mobile app for iOS and Android.
          </p>
        </Link>

        <Link
          href="/api"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            API{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            NestJS backend with PostgreSQL database.
          </p>
        </Link>
      </div>
    </div>
  )
}
