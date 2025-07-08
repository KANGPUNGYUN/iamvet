// src/components/layout/Footer/types.ts
export interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export interface FooterLogoProps {
  src?: string;
  alt?: string;
  mobileSrc?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface FooterNavProps {
  children: React.ReactNode;
  className?: string;
}

export interface FooterNavItemProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export interface FooterContactProps {
  children: React.ReactNode;
  className?: string;
}

export interface FooterAddressProps {
  children: React.ReactNode;
  className?: string;
}

export interface FooterContentWrapProps {
  children: React.ReactNode;
  className?: string;
}

export interface FooterCopyrightProps {
  children: React.ReactNode;
  className?: string;
}
