import Link from "next/link"

type AuthNavBarProps = {
  active: "login" | "register" | "recover"
}

export default function AuthNavBar({ active }: AuthNavBarProps) {
  // Define all possible links
  const links = [
    { href: "/auth", label: "Login", key: "login" },
    { href: "/auth/new", label: "Create a new Account", key: "register" },
    // { href: "/auth/recover", label: "Reset a Forgotten Password", key: "recover" },
  ]

  // Filter out the active link (optional: highlight instead of hiding if you prefer)
  const visibleLinks = links.filter((link) => link.key !== active)

  return (
    <nav className="mt-4 flex justify-between text-xs">
      {visibleLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
