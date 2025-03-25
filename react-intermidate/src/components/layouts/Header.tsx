import MainNavigation from "@/components/layouts/MainNavigation";
import { siteConfig } from "@/config/site";
import { NavItemWithChildren } from "@/types";
import MobileNavigation from "@/components/layouts/MobileNavigation";
import { ModeToggle } from "../mode-toggle";
import AuthDropDown from "./AuthDropDown";
import { User } from "@/data/user";

function Header() {
  return (
    <header className="bg-background fixed z-50 w-full border-b">
      <nav className="container mx-auto flex h-16 items-center lg:px-16">
        <MainNavigation
          items={siteConfig.mainNav as unknown as NavItemWithChildren[]}
        />
        <MobileNavigation
          items={siteConfig.mainNav as unknown as NavItemWithChildren[]}
        />
        <div className="mr-8 flex flex-1 items-center justify-end space-x-4 lg:mr-0">
          <ModeToggle />
          <AuthDropDown user={User} />
        </div>
      </nav>
    </header>
  );
}

export default Header;
