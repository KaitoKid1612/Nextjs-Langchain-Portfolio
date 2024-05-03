import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import AIChatButton from "./AIChatButton";

export default function Navbar() {
    return (
        <header className="sticky top-0 bg-background">
            <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-3 px-3 py-4">
                <nav className="space-x-4 font-medium">
                    <Link href="/">Home</Link>
                    <Link href="/about">About Me</Link>
                    <Link href="/projects">Projects</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <AIChatButton />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}