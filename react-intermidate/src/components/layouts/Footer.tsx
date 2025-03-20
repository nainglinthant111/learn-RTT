import { Link } from "react-router-dom";
import { Icons } from "../icons";
import { siteConfig } from "@/config/site";
import NewsSelectorForm from "../new-letter";

function Footer() {
  return (
    <footer className="ml-4 w-full border-t lg:ml-0">
      <div className="lg-px-16 container mx-auto items-center pt-6 pb-8 lg:px-15">
        <section className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
          <section className="">
            <Link to="" className="flex items-center space-x-2">
              <Icons.logo aria-hidden="true" className="size-6" />
              <span className="font-bold">Ho{siteConfig.name}</span>
              <span className="sr-only">Home</span>
            </Link>
          </section>
          <section className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {siteConfig.footerNav.map((group) => (
              <div className="space-y-3" key={group.title}>
                <h4 className="font-medium">{group.title}</h4>
                <ul className="">
                  {group.items.map((item) => (
                    <li className="" key={item.title}>
                      <Link
                        to={item.href}
                        target={item.external ? "_blank" : undefined}
                        className="text-muted-foreground hover:text-foreground text-sm"
                      >
                        {item.title}
                      </Link>
                      <span className="sr-only">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="font-medium">Subscrite to our newsletter</h4>
            <NewsSelectorForm />
          </section>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
