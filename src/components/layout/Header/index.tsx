import { Header } from "./Header";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";
import { HeaderAuth } from "./HeaderAuth";
import { HeaderProfile } from "./HeaderProfile";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

// Composite Component 패턴
const HeaderComponent = Object.assign(Header, {
  Logo: HeaderLogo,
  Navigation: HeaderNavigation,
  Auth: HeaderAuth,
  Profile: HeaderProfile,
  MobileMenu: HeaderMobileMenu,
});

export { HeaderComponent as Header };
export type {
  HeaderProps,
  HeaderLogoProps,
  HeaderNavigationProps,
  HeaderAuthProps,
  HeaderProfileProps,
  HeaderMobileMenuProps,
  User,
  NavigationItem,
} from "./types";