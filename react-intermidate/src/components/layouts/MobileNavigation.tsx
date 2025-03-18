import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { MainNavItem } from "@/types";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

interface MainNavProps {
    items: MainNavItem[];
}
function MobileNavigation({ items }: MainNavProps) {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-5 ml-4"
                    >
                        <Icons.menu aria-hidden="true" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="p-4 pt-9"
                >
                    <SheetClose asChild>
                        <Link
                            to="/"
                            className="flex items-center space-x-2"
                        >
                            <Icons.logo
                                aria-hidden="true"
                                className="size-4"
                            />
                            <span>{siteConfig.name}</span>
                            <span className="sr-only">Home</span>
                        </Link>
                    </SheetClose>
                    <ScrollArea className="my-y h-[calc(100vh-8rem)]">
                        <Accordion
                            type="multiple"
                            className="w-full border-b"
                        >
                            <AccordionItem value={items?.[0]?.title}>
                                <AccordionTrigger>
                                    {items?.[0].title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col space-y-2 pl-2">
                                        {items?.[0]?.card &&
                                            items[0].card.map((item) => (
                                                <SheetClose
                                                    asChild
                                                    key={item.title}
                                                >
                                                    <Link
                                                        to={String(item.href)}
                                                        className="text-foreground/70"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex flex-col space-y-2 mt-4">
                            {items?.[0]?.menu &&
                                items[0].menu.map((item) => (
                                    <SheetClose
                                        asChild
                                        key={item.title}
                                    >
                                        <Link to={String(item.href)}>
                                            {item.title}
                                        </Link>
                                    </SheetClose>
                                ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileNavigation;
