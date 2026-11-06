import type * as React from 'react';
/** Names of the built-in spot illustrations (see the Icons asset group). */
export type IconName = 'panel-upgrades' | 'ev-charger-installation' | 'generator-installation' | 'electrical-repair' | 'emergency-electrician' | 'home-rewiring' | 'lighting-installation' | 'outbuilding-well-pump-wiring' | 'hot-tub-spa-wiring' | 'solar-battery-electrical' | 'electrical-inspection' | 'commercial-electrical' | 'costs' | 'safety' | 'outages' | 'ev-solar' | 'older' | 'rules' | 'check' | 'pin' | 'clock' | 'permit' | 'tower' | 'mountain' | 'phone' | 'mail' | 'quote';
export interface ButtonProps { variant?: 'primary' | 'outline'; size?: 'md' | 'lg'; block?: boolean; icon?: IconName; href?: string; type?: 'button' | 'submit'; onClick?: () => void; children: React.ReactNode }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface IconProps { name: IconName; size?: number; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface MedalProps { icon: IconName; size?: 'lg' | 'sm' }
export declare function Medal(props: MedalProps): React.ReactElement;
export interface LogoProps { variant?: 'lockup' | 'mark'; size?: number }
export declare function Logo(props: LogoProps): React.ReactElement;
export interface ServiceTileProps { icon: IconName; name: string; blurb?: string; cost?: string; href?: string }
export declare function ServiceTile(props: ServiceTileProps): React.ReactElement;
export interface FeaturedServiceProps { icon: IconName; name: string; blurb: string; cost: string; href?: string; linkLabel?: string }
export declare function FeaturedService(props: FeaturedServiceProps): React.ReactElement;
export interface TownCardProps { name: string; blurb: string; utility?: 'PG&E' | 'SMUD' | 'Roseville Electric Utility'; services?: { icon: IconName; label: string }[]; home?: boolean; href?: string }
export declare function TownCard(props: TownCardProps): React.ReactElement;
export interface UtilityTagProps { utility: 'PG&E' | 'SMUD' | 'Roseville Electric Utility' }
export declare function UtilityTag(props: UtilityTagProps): React.ReactElement;
export interface ChipProps { href?: string; children: React.ReactNode }
export declare function Chip(props: ChipProps): React.ReactElement;
export interface JumpMenuProps { items: { href: string; label: string }[] }
export declare function JumpMenu(props: JumpMenuProps): React.ReactElement;
export interface QuestionListProps { items: { icon: IconName; question: string; answer: string; href?: string }[] }
export declare function QuestionList(props: QuestionListProps): React.ReactElement;
export interface TickListProps { items: string[] }
export declare function TickList(props: TickListProps): React.ReactElement;
export interface AtAGlanceProps { cost: string; note?: string; rows?: { label: string; value: string }[]; title?: string; fine?: string }
export declare function AtAGlance(props: AtAGlanceProps): React.ReactElement;
export interface FaqItemProps { question: string; open?: boolean; children: React.ReactNode }
export declare function FaqItem(props: FaqItemProps): React.ReactElement;
export interface StepsProps { steps: { title: string; text: string }[] }
export declare function Steps(props: StepsProps): React.ReactElement;
export interface FactListProps { facts: { icon: IconName; label: string; value: string }[] }
export declare function FactList(props: FactListProps): React.ReactElement;
export interface CtaBandProps { text: string; quoteHref?: string; phone?: string }
export declare function CtaBand(props: CtaBandProps): React.ReactElement;
export interface HelpChooserProps { title?: string | false; hrefs?: Partial<Record<'quote' | 'call' | 'message' | 'emergency', string>>; onPick?: (key: 'quote' | 'call' | 'message' | 'emergency') => void }
export declare function HelpChooser(props: HelpChooserProps): React.ReactElement;
export interface QuoteFormProps { towns: string[]; services: string[]; service?: string }
export declare function QuoteForm(props: QuoteFormProps): React.ReactElement;
export interface EmergencyStepsProps { phone?: string }
export declare function EmergencySteps(props: EmergencyStepsProps): React.ReactElement;
declare global { interface Window { Off80: { Button: typeof Button; Icon: typeof Icon; Medal: typeof Medal; Logo: typeof Logo; ServiceTile: typeof ServiceTile; FeaturedService: typeof FeaturedService; TownCard: typeof TownCard; UtilityTag: typeof UtilityTag; Chip: typeof Chip; JumpMenu: typeof JumpMenu; QuestionList: typeof QuestionList; TickList: typeof TickList; AtAGlance: typeof AtAGlance; FaqItem: typeof FaqItem; Steps: typeof Steps; FactList: typeof FactList; CtaBand: typeof CtaBand; HelpChooser: typeof HelpChooser; QuoteForm: typeof QuoteForm; EmergencySteps: typeof EmergencySteps } } }
