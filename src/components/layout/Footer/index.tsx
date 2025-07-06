// src/components/layout/Footer/index.tsx
import { Footer } from "./Footer";
import { FooterLogo } from "./FooterLogo";
import { FooterNav } from "./FooterNav";
import { FooterNavItem } from "./FooterNavItem";
import { FooterContact } from "./FooterContact";
import { FooterCopyright } from "./FooterCopyright";
import { FooterContentWrap } from "./FooterContentWrap";
import { FooterAddress } from "./FooterAddress";
import "./Footer.css";

// Composite Component 패턴
const FooterComponent = Object.assign(Footer, {
  Logo: FooterLogo,
  Nav: FooterNav,
  NavItem: FooterNavItem,
  Contact: FooterContact,
  Copyright: FooterCopyright,
  ContentWrap: FooterContentWrap,
  Address: FooterAddress,
});

export { FooterComponent as Footer };
export type {
  FooterProps,
  FooterLogoProps,
  FooterNavProps,
  FooterNavItemProps,
  FooterContactProps,
  FooterCopyrightProps,
  FooterContentWrapProps,
  FooterAddressProps,
} from "./types";
