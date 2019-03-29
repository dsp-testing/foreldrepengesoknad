import { Regel, RegelAlvorlighet } from './types';
import { inneholderUttaksplanPerioderTest } from './tester/inneholderUttaksplanPerioderTest';
import { harMorSøktUgyldigUttakFørsteSeksUkerTest } from './tester/harMorSøktUgyldigUttakFørsteSeksUkerTest';
import { inneholderStønadskontoForMyeUttakTest } from './tester/inneholderStønadskontoForMyeUttakTest';
import { harFarMedmorSøktUgyldigUttakEllerUtsettelseFørsteSeksUkerTest } from './tester/harFarMedmorSøktUgyldigUttakEllerUtsettelseFørsteSeksUkerTest';
import { erUttaksplanBareOppholdTest } from './tester/erUttaksplanBareOppholdTest';
import { slutterUttaksplanMedOppholdTest } from './tester/slutterUttaksplanMedOppholdTest';
import { starterUttaksplanMedOppholdTest } from './tester/starterUttaksplanMedOppholdTest';
import { erUttaksplanGraderingStørreEnnSamtidigUttakTest } from './tester/erUttaksplanGraderingStørreEnnSamtidigUttakTest';
import { erBegrunnelseForSenEndringGyldigTest } from './tester/erBegrunnelseForSenEndringGyldigTest';
import { harUttaksplanForMangeFlerbarnsdagerTest } from './tester/harUttaksplanForMangeFlerbarnsdagerTest';
import { erUttaksmengdeForFarMedmorForHøyTest } from './tester/erUttaksmengdeForFarMedmorForHøyTest';
import { inneholderUttaksplanDatoSomIkkeErUttaksdag } from './tester/inneholderUttaksplanDatoSomIkkeErUttaksdagTest';
import { harPerioderManglendeVedleggTest } from './tester/harPerioderManglendeVedleggTest';
import { inneholderSenUtsettelsePgaFerieTest } from './tester/inneholderSenUtsettelsePgaFerieTest';
import { inneholderTapteDagerTest } from './tester/inneholderTapteDager';

export enum RegelKey {
    'planenInneholderIngenPerioder' = 'planenInneholderIngenPerioder',
    'morHarSøktUgyldigUttakFørsteSeksUker' = 'morHarSøktUgyldigUttakFørsteSeksUker',
    'farMedmorHarSøktUgyldigUttakEllerUtsettelseFørsteSeksUker' = 'farMedmorHarSøktUgyldigUttakEllerUtsettelseFørsteSeksUker',
    'stønadskontoInneholderForMyeUttak' = 'stønadskontoInneholderForMyeUttak',
    'uttaksplanErBareOpphold' = 'uttaksplanErBareOpphold',
    'uttaksplanStarterMedOpphold' = 'uttaksplanStarterMedOpphold',
    'uttaksplanSlutterMedOpphold' = 'uttaksplanSlutterMedOpphold',
    'uttaksplanGraderingStørreEnnSamtidigUttak' = 'uttaksplanGraderingStørreEnnSamtidigUttak',
    'begrunnelseVedForSenEndringErUgyldig' = 'begrunnelseVedForSenEndringErUgyldig',
    'uttaksplanHarForMangeFlerbarnsdager' = 'uttaksplanHarForMangeFlerbarnsdager',
    'uttaksmengdeForFarMedmorErForHøy' = 'uttaksmengdeForFarMedmorErForHøy',
    'uttaksplanInneholderDatoSomIkkeErUttaksdag' = 'uttaksplanInneholderDatoSomIkkeErUttaksdag',
    'perioderManglerVedlegg' = 'manglendeVedlegg',
    'inneholderSenUtsettelsePgaFerie' = 'inneholderSenUtsettelsePgaFerieTest',
    'inneholderTapteDager' = 'inneholderTapteDager'
}

const uttaksplanRegler: Regel[] = [
    {
        key: RegelKey.planenInneholderIngenPerioder,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: inneholderUttaksplanPerioderTest
    },
    {
        key: RegelKey.stønadskontoInneholderForMyeUttak,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: inneholderStønadskontoForMyeUttakTest
    },
    {
        key: RegelKey.morHarSøktUgyldigUttakFørsteSeksUker,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: harMorSøktUgyldigUttakFørsteSeksUkerTest
    },
    {
        key: RegelKey.farMedmorHarSøktUgyldigUttakEllerUtsettelseFørsteSeksUker,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: harFarMedmorSøktUgyldigUttakEllerUtsettelseFørsteSeksUkerTest
    },
    {
        key: RegelKey.uttaksplanErBareOpphold,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: erUttaksplanBareOppholdTest
    },
    {
        key: RegelKey.uttaksplanStarterMedOpphold,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: starterUttaksplanMedOppholdTest
    },
    {
        key: RegelKey.uttaksplanSlutterMedOpphold,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: slutterUttaksplanMedOppholdTest
    },
    {
        key: RegelKey.uttaksplanGraderingStørreEnnSamtidigUttak,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: erUttaksplanGraderingStørreEnnSamtidigUttakTest
    },
    {
        key: RegelKey.begrunnelseVedForSenEndringErUgyldig,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: erBegrunnelseForSenEndringGyldigTest
    },
    {
        key: RegelKey.uttaksplanHarForMangeFlerbarnsdager,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: harUttaksplanForMangeFlerbarnsdagerTest
    },
    {
        key: RegelKey.uttaksmengdeForFarMedmorErForHøy,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: erUttaksmengdeForFarMedmorForHøyTest
    },
    {
        key: RegelKey.uttaksplanInneholderDatoSomIkkeErUttaksdag,
        alvorlighet: RegelAlvorlighet.FEIL,
        test: inneholderUttaksplanDatoSomIkkeErUttaksdag
    },
    {
        key: RegelKey.perioderManglerVedlegg,
        alvorlighet: RegelAlvorlighet.INFO,
        test: harPerioderManglendeVedleggTest,
        slåsSammenVedOppsummering: true
    },
    {
        key: RegelKey.inneholderSenUtsettelsePgaFerie,
        alvorlighet: RegelAlvorlighet.INFO,
        test: inneholderSenUtsettelsePgaFerieTest
    },
    {
        key: RegelKey.inneholderTapteDager,
        alvorlighet: RegelAlvorlighet.INFO,
        test: inneholderTapteDagerTest
    }
];

export default uttaksplanRegler;
