import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "react-router-dom";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const navItems = [
    { label: "Alumni", href: "/" },
    { label: "Work History", href: "/work-history" },
    { label: "Events", href: "/events" },
    { label: "Participation", href: "/participation" },
  ];

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Brand */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link className="flex items-center gap-2" to="/">
            <Logo />
            <p className="font-bold text-inherit text-lg">ABC Alumni</p>
          </Link>
        </NavbarBrand>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-4 ml-4">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className="text-default-700 hover:text-primary transition-colors font-medium"
                to={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* Right side */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarMenuToggle className="lg:hidden" />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        <div className="flex flex-col gap-3 mt-4 px-4">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Link
                className="text-lg font-medium text-default-700 hover:text-primary transition-colors"
                to={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
