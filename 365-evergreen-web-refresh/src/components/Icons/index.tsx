import * as React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { title?: string };

export const Send24Regular: React.FC<IconProps> = ({ title = 'Send', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? undefined : true} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M2 21L22 12L2 3v7l13 2-13 2v7z" fill="currentColor" />
  </svg>
);

export const CheckmarkCircle24Regular: React.FC<IconProps> = ({ title = 'Check', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7.5 12.5l2.5 2.5L16.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const PeopleTeam24Regular: React.FC<IconProps> = ({ title = 'Team', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M12 12a3 3 0 100-6 3 3 0 000 6zM4 20a4 4 0 018 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20a3 3 0 00-3-3h-1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PeopleTeamToolbox24Regular: React.FC<IconProps> = ({ title = 'Team Toolbox', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export const Flash24Regular: React.FC<IconProps> = ({ title = 'Flash', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z" fill="currentColor" />
  </svg>
);

export const BrainCircuit24Regular: React.FC<IconProps> = ({ title = 'Brain', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M12 3c3 0 4 2 4 4v1a4 4 0 010 8v1c0 2-1 4-4 4s-4-2-4-4v-1a4 4 0 010-8V7c0-2 1-4 4-4z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <path d="M8 12h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const ChevronRight24Filled: React.FC<IconProps> = ({ title = 'Chevron Right', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDown24Regular: React.FC<IconProps> = ({ title = 'Chevron Down', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowLeft24Regular: React.FC<IconProps> = ({ title = 'Arrow Left', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDownload24Regular: React.FC<IconProps> = ({ title = 'Download', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="4" y="17" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export const LeafThree24Regular: React.FC<IconProps> = ({ title = 'Leaf', ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M12 3c4 0 7 3 7 7 0 4-3 8-7 11-4-3-7-7-7-11 0-4 3-7 7-7z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 7c3 1 5 4 5 4" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

export default {
  Send24Regular,
  CheckmarkCircle24Regular,
  PeopleTeam24Regular,
  PeopleTeamToolbox24Regular,
  Flash24Regular,
  BrainCircuit24Regular,
  ChevronRight24Filled,
  ChevronDown24Regular,
  ArrowLeft24Regular,
  ArrowDownload24Regular,
  LeafThree24Regular,
};
