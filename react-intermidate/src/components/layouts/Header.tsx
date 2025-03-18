import MainNavigation from "@/components/layouts/MainNavigation";
import { siteConfig } from "@/config/site";
import { NavItemWithChildren } from "@/types";
import MobileNavigation from "@/components/layouts/MobileNavigation";
import { ModeToggle } from "../mode-toggle";

function Header() {
    return (
        <header className="w-full border-b">
            <nav className="container flex items-center h-16 mx-auto lg:px-16">
                <MainNavigation
                    items={
                        siteConfig.mainNav as unknown as NavItemWithChildren[]
                    }
                />
                <MobileNavigation
                    items={
                        siteConfig.mainNav as unknown as NavItemWithChildren[]
                    }
                />
                <div className="flex items-center justify-end space-x-4 flex-1 mr-8 lg:mr-0">
                    <ModeToggle />
                </div>
            </nav>
        </header>
    );
}

export default Header;
