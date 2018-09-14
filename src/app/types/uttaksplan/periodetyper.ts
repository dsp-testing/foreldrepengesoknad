import { Tidsperiode, Forelder } from 'common/types';
import { Attachment } from 'common/storage/attachment/types/Attachment';

export enum Periodetype {
    'Uttak' = 'uttak',
    'Utsettelse' = 'utsettelse',
    'Opphold' = 'opphold'
}

export enum StønadskontoType {
    /** Kvote forbeholdt mor */
    'Mødrekvote' = 'MØDREKVOTE',
    /** Kvote forbehold medforelder */
    'Fedrekvote' = 'FEDREKVOTE',
    /** Felleskvote som kan fordeles mellom mor og medforelder */
    'Fellesperiode' = 'FELLESPERIODE',
    /** Når det kun er en forsørger/forelder */
    'Foreldrepenger' = 'FORELDREPENGER',
    /** Når det kun er en forsørger/forelder */
    'ForeldrepengerFørFødsel' = 'FORELDREPENGER_FØR_FØDSEL',
    /** Når det kun er en forsørger/forelder */
    'SamtidigUttak' = 'SAMTIDIGUTTAK',
    'Flerbarnsuker' = 'FLERBARNSUKER'
}

export enum UtsettelseÅrsakType {
    'Ferie' = 'LOVBESTEMT_FERIE',
    'Arbeid' = 'ARBEID',
    'Sykdom' = 'SYKDOM',
    'InstitusjonSøker' = 'INSTITUSJONSOPPHOLD_SØKER',
    'InstitusjonBarnet' = 'INSTITUSJONSOPPHOLD_BARNET'
}

export enum OppholdÅrsakType {
    'UttakFellesperiodeAnnenForelder' = 'UTTAK_FELLESP_ANNEN_FORELDER',
    'UttakKvoteAnnenForelder' = 'UTTAK_KVOTE_ANNEN_FORELDER'
}

export interface Helligdag {
    dato: Date;
    navn: string;
}

export interface PeriodeBase {
    id?: string;
    type: Periodetype;
    tidsperiode: Tidsperiode;
    vedlegg?: Attachment[];
}

export interface Uttaksperiode extends PeriodeBase {
    type: Periodetype.Uttak;
    konto: StønadskontoType;
    forelder: Forelder;
    gradert?: boolean;
    morsAktivitetIPerioden?: MorsAktivitet;
    ønskerSamtidigUttak: boolean;
}

interface UtsettelsesperiodeBase extends PeriodeBase {
    type: Periodetype.Utsettelse;
    årsak: UtsettelseÅrsakType;
    forelder: Forelder;
    helligdager?: Helligdag[];
}

export interface UtsettelsePgaArbeidPeriode extends UtsettelsesperiodeBase {
    årsak: UtsettelseÅrsakType.Arbeid;
    orgnr: string;
    skalJobbeSomFrilansEllerSelvstendigNæringsdrivende: boolean;
}
export interface UtsettelsePgaFerie extends UtsettelsesperiodeBase {
    årsak: UtsettelseÅrsakType.Ferie;
}
export interface UtsettelsePgaSykdom extends UtsettelsesperiodeBase {
    årsak: UtsettelseÅrsakType.Sykdom;
}
export interface UtsettelsePgaInnleggelseBarnet extends UtsettelsesperiodeBase {
    årsak: UtsettelseÅrsakType.InstitusjonBarnet;
}
export interface UtsettelsePgaInnleggelseSøker extends UtsettelsesperiodeBase {
    årsak: UtsettelseÅrsakType.InstitusjonSøker;
}

export type Utsettelsesperiode =
    | UtsettelsePgaArbeidPeriode
    | UtsettelsePgaFerie
    | UtsettelsePgaSykdom
    | UtsettelsePgaInnleggelseSøker
    | UtsettelsePgaInnleggelseBarnet;

export interface GradertUttaksperiode extends Uttaksperiode {
    årsak: UtsettelseÅrsakType.Arbeid;
    gradert: true;
    stillingsprosent: string;
    orgnr: string;
    skalJobbeSomFrilansEllerSelvstendigNæringsdrivende: boolean;
}

export interface Oppholdsperiode extends PeriodeBase {
    type: Periodetype.Opphold;
    årsak: OppholdÅrsakType;
}

export type Periode = Uttaksperiode | Utsettelsesperiode | Oppholdsperiode;

export interface TilgjengeligStønadskonto {
    konto: StønadskontoType;
    dager: number;
}

export enum MorsAktivitet {
    'Arbeid' = 'ARBEID',
    'Utdanning' = 'UTDANNING',
    'Kvalifiseringsprogrammet' = 'KVALPROG',
    'Introduksjonsprogrammet' = 'INTROPROG',
    'TrengerHjelp' = 'TRENGER_HJELP',
    'Innlagt' = 'INNLAGT',
    'ArbeidOgUtdanning' = 'ARBEID_OG_UTDANNING',
    'SamtidigUttak' = 'SAMTIDIGUTTAK'
}
