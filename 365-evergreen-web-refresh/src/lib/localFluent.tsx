import * as React from 'react';

// Minimal local replacements for @fluentui/react-components used in the app.
// These provide a compatible API surface for the app's current usage.

type AnyProps = any;

// Input/Textarea change signature used across the app: (e, { value })
type ChangeWithValue = (e: React.ChangeEvent<any>, data: { value: string }) => void;
type ChangeWithChecked = (e: React.ChangeEvent<any>, data: { checked: boolean }) => void;

export const FluentProvider: React.FC<any> = ({ children }) => <>{children}</>;
export const webLightTheme = {};

export const Button: React.FC<AnyProps> = ({ children, className, appearance, size, type, ...rest }) => (
  <button type={type} className={className} data-appearance={appearance} data-size={size} {...rest}>
    {children}
  </button>
);

export type FluentInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange?: ChangeWithValue;
  [key: string]: any;
};

export const Input: React.FC<FluentInputProps> = React.forwardRef(function Input(props: FluentInputProps, ref: any) {
  const { onChange, ...rest } = props;
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e, { value: e.currentTarget.value });
  };
  return <input ref={ref} onChange={handle} {...(rest as any)} />;
});

export type FluentTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  onChange?: ChangeWithValue;
  [key: string]: any;
};

export const Textarea: React.FC<FluentTextareaProps> = React.forwardRef(function Textarea(props: FluentTextareaProps, ref: any) {
  const { onChange, ...rest } = props;
  const handle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e, { value: e.currentTarget.value });
  };
  return <textarea ref={ref} onChange={handle} {...(rest as any)} />;
});

export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>;

export const Spinner: React.FC<{ label?: string } & AnyProps> = ({ label }) => (
  <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 20, height: 20, border: '2px solid #ccc', borderTopColor: 'currentColor', borderRadius: '50%' }} />
    {label && <div>{label}</div>}
  </div>
);

// Breadcrumbs
export const Breadcrumb: React.FC<AnyProps> = ({ children, className }) => (
  <nav aria-label="breadcrumb" className={className}>{children}</nav>
);
export const BreadcrumbItem: React.FC<AnyProps> = ({ children }) => <span>{children}</span>;

// Drawer simplified - not accessible/full-featured but works as a panel container
export const Drawer: React.FC<{ open: boolean; position?: 'start' | 'end'; onOpenChange?: (e: any, data: { open: boolean }) => void } & AnyProps> = ({ open, children, position = 'end', onOpenChange }) => {
  React.useEffect(() => { if (onOpenChange) onOpenChange(undefined, { open }); }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: position === 'end' ? 0 : undefined, left: position === 'start' ? 0 : undefined, bottom: 0, width: '360px', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 1000 }}>
      {children}
    </div>
  );
};
export const DrawerBody: React.FC<AnyProps> = ({ children, className }) => <div className={className}>{children}</div>;

// Form controls: Radio, RadioGroup, Checkbox
export type FluentCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange?: ChangeWithChecked;
  [key: string]: any;
};

export const Checkbox: React.FC<FluentCheckboxProps> = ({ checked, onChange, ...rest }) => (
  <input type="checkbox" checked={checked} onChange={(e) => onChange && onChange(e, { checked: e.currentTarget.checked })} {...(rest as any)} />
);

export type FluentRadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => void;
  [key: string]: any;
};

export const Radio: React.FC<FluentRadioProps> = ({ value, checked, onChange, ...rest }) => (
  <input type="radio" value={value} checked={checked} onChange={(e) => onChange && onChange(e, { value: e.currentTarget.value })} {...(rest as any)} />
);

export type FluentRadioGroupProps = {
  value?: string;
  onChange?: (e: any, data: { value: string }) => void;
  children?: React.ReactNode;
  [key: string]: any;
};

export const RadioGroup: React.FC<FluentRadioGroupProps> = ({ value, onChange, children, ...rest }) => (
  <div role="radiogroup" {...(rest as any)}>{React.Children.map(children, (c) => c)}</div>
);

// Minimal carousel shims used by FluentCarousel component
export const Carousel: React.FC<AnyProps> = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export const CarouselCard: React.FC<AnyProps> = ({ children, className, ...rest }) => <div className={className} {...rest}>{children}</div>;
export const CarouselNav: React.FC<AnyProps> = ({ children }) => <div>{children}</div>;
export const CarouselNavButton: React.FC<AnyProps> = (props) => <button {...props} />;
export const CarouselNavContainer: React.FC<AnyProps> = ({ children }) => <div>{children}</div>;
export const CarouselSlider: React.FC<AnyProps> = ({ children }) => <div>{children}</div>;
export const CarouselViewport: React.FC<AnyProps> = ({ children }) => <div>{children}</div>;
export const makeStyles = (styles: Record<string, any>) => () => styles as any;
export const tokens = { colorNeutralBackground1: 'transparent', shadow28: 'none', borderRadiusLarge: '0px', borderRadiusMedium: '0px' } as any;
export const typographyStyles = { title1: {}, body1: {} } as any;

export type CarouselAnnouncerFunction = (index: number, totalSlides: number) => string;

export default {
  FluentProvider,
  webLightTheme,
  Button,
  Input,
  Textarea,
  Link,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  Drawer,
  DrawerBody,
  Radio,
  RadioGroup,
  Checkbox,
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselSlider,
  CarouselViewport,
  makeStyles,
  tokens,
  typographyStyles,
};

// Accordion components used by DynamicAccordion
export const Accordion: React.FC<any> = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export const AccordionItem: React.FC<any> = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export const AccordionHeader: React.FC<any> = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export const AccordionPanel: React.FC<any> = ({ children, ...rest }) => <div {...rest}>{children}</div>;

// Re-export default with the new accordion members too
export const __all = {
  FluentProvider,
  webLightTheme,
  Button,
  Input,
  Textarea,
  Link,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  Drawer,
  DrawerBody,
  Radio,
  RadioGroup,
  Checkbox,
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselSlider,
  CarouselViewport,
  makeStyles,
  tokens,
  typographyStyles,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
};
