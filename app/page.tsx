import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="font-bold text-7xl">Smart POS</h1>
        <div className="flex flex-col items-center  text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Start Selling Fast....
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Point of Sale and inventory management system, giving you real-time stock tracking, expiry monitor, and audit-ready financial reporting for your business.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
            href="/auth"
            rel="noopener noreferrer"
          >
            Login
          </Link>
          
        </div>
      </main>
    </div>
  );
}
