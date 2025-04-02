import type { User } from "@/types";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "../icons";

interface userProps {
  user: User;
}
function AuthDropDown({ user }: userProps) {
  const initialName = `${user.firstName.charAt(0) ?? ""} ${user.lastName.charAt(0) ?? ""}`;
  if (!user) {
    return (
      <Button asChild size={"sm"}>
        <Link to="/signin">Sigin In</Link>
        <span className="sr-only"> SignIn</span>
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" className="size-8 rounded-full" asChild>
          <Avatar className="size-8">
            <AvatarImage src={user.imageUrl} alt={initialName} />
            <AvatarFallback>{initialName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-sm leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.dashboard className="mr-2 size-4" aria-hidden="true" />
            Dashboard
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Icons.gear className="mr-2 size-4" aria-hidden="true" />
            Settings
            <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/login" className="flex">
              <Icons.exit className="mr-4 size-4" aria-hidden="true" />
              Logout
            </Link>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default AuthDropDown;
