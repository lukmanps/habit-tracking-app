import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    header?: React.ReactNode;
    showBottomNav?: boolean;
}

export default function PageLayout({ children, title, header, showBottomNav = true }: PageLayoutProps) {
    return (
        <div className="flex flex-col h-[100dvh] bg-white dark:bg-neutral-950 relative font-sans overflow-hidden transition-colors">
            <div className="flex flex-col h-full pb-24">
                {header ? (
                    <div className="shrink-0 z-10 bg-white dark:bg-neutral-950 transition-colors">
                        {header}
                    </div>
                ) : title ? (
                    <div className="px-6 pt-8 pb-4 shrink-0 z-10 bg-white dark:bg-neutral-950 transition-colors">
                        <h1 className="text-3xl font-bold text-left text-neutral-900 dark:text-white">{title}</h1>
                    </div>
                ) : null}

                {/* Main Content */}
                {children}
            </div>

            {showBottomNav && <BottomNav />}
        </div>
    );
}
