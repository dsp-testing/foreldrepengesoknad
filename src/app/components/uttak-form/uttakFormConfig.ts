import { QuestionConfig, Questions, QuestionVisibility, questionValueIsOk } from '../../util/questions/Question';
import { getValidTidsperiode } from '../../util/uttaksplan/Tidsperioden';
import { Tidsperiode } from 'nav-datovelger';
import {
    StønadskontoType,
    Periodetype,
    OverføringÅrsakType,
    isForeldrepengerFørFødselUttaksperiode
} from '../../types/uttaksplan/periodetyper';
import { UttakFormPeriodeType } from './UttakForm';
import { erUttakEgenKvote } from '../../util/uttaksplan/uttakUtils';

export enum UttakSpørsmålKeys {
    'tidsperiode' = 'tidsperiode',
    'kvote' = 'kvote',
    'samtidigUttak' = 'samtidigUttak',
    'aktivitetskravMor' = 'aktivitetskravMor',
    'overføringsårsak' = 'overføringsårsak',
    'overføringsdokumentasjon' = 'overføringsdokumentasjon',
    'skalHaGradering' = 'skalHaGradering',
    'stillingsprosent' = 'stillingsprosent',
    'hvorSkalDuJobbe' = 'hvorSkalDuJobbe'
}

export interface UttakFormPayload {
    periode: UttakFormPeriodeType;
    velgbareStønadskontotyper: StønadskontoType[];
    kanEndreStønadskonto: boolean;
    søkerErAleneOmOmsorg: boolean;
    søkerErFarEllerMedmor: boolean;
    annenForelderHarRett: boolean;
    morErUfør: boolean;
}

export type UttakSpørsmålVisibility = QuestionVisibility<UttakSpørsmålKeys>;

const Sp = UttakSpørsmålKeys;

const visAktivitetskravMor = (payload: UttakFormPayload): boolean => {
    const { periode, søkerErFarEllerMedmor, annenForelderHarRett, søkerErAleneOmOmsorg } = payload;
    if (søkerErFarEllerMedmor === false || periode.konto === undefined) {
        return false;
    }
    const erDeltUttak = søkerErAleneOmOmsorg === false && annenForelderHarRett === true;
    if (
        erDeltUttak &&
        (periode.konto === StønadskontoType.Fellesperiode || periode.konto === StønadskontoType.Foreldrepenger)
    ) {
        return true;
    }
    return false;
};

const visSamtidigUttak = (payload: UttakFormPayload): boolean => {
    const { periode, søkerErFarEllerMedmor, annenForelderHarRett, søkerErAleneOmOmsorg } = payload;
    if (
        periode.konto === undefined ||
        periode.type === Periodetype.Overføring ||
        periode.konto === StønadskontoType.ForeldrepengerFørFødsel
    ) {
        return false;
    } else if (periode.type === Periodetype.Uttak && periode.konto !== undefined) {
        const erEgenKonto = erUttakEgenKvote(periode.konto, payload.søkerErFarEllerMedmor);
        const aktivitetskravMor = visAktivitetskravMor(payload);
        const aktivitetskravMorOk =
            (aktivitetskravMor && questionValueIsOk(periode.morsAktivitetIPerioden)) || aktivitetskravMor === false;
        const erDeltUttak = !søkerErAleneOmOmsorg && annenForelderHarRett;
        if (
            periode.konto === StønadskontoType.Fellesperiode &&
            søkerErFarEllerMedmor === true &&
            aktivitetskravMorOk &&
            erDeltUttak
        ) {
            return true;
        }
        if (periode.konto === StønadskontoType.Fellesperiode && søkerErFarEllerMedmor === false && erDeltUttak) {
            return true;
        }
        if (erEgenKonto && aktivitetskravMorOk && erDeltUttak) {
            return true;
        }
        if (
            søkerErFarEllerMedmor &&
            periode.konto === StønadskontoType.Fellesperiode &&
            aktivitetskravMorOk &&
            erDeltUttak
        ) {
            return true;
        }
        if (periode.konto === StønadskontoType.Flerbarnsdager && aktivitetskravMorOk && erDeltUttak) {
            return true;
        }
    }
    return false;
};

const visOverføringsdokumentasjon = (payload: UttakFormPayload): boolean => {
    const { periode } = payload;
    if (periode.type !== Periodetype.Overføring || periode.årsak === undefined) {
        return false;
    }
    return (
        periode.årsak !== OverføringÅrsakType.aleneomsorg ||
        (periode.årsak === OverføringÅrsakType.aleneomsorg && payload.søkerErFarEllerMedmor === true)
    );
};

const visGradering = (payload: UttakFormPayload): boolean => {
    const { periode, morErUfør } = payload;
    if (
        periode.konto === undefined ||
        periode.type !== Periodetype.Uttak ||
        periode.konto === StønadskontoType.ForeldrepengerFørFødsel ||
        morErUfør ||
        (visSamtidigUttak(payload) && periode.ønskerSamtidigUttak === undefined) ||
        (visAktivitetskravMor(payload) && periode.morsAktivitetIPerioden === undefined)
    ) {
        return false;
    }
    return true;
};

export const uttaksperiodeFormConfig: QuestionConfig<UttakFormPayload, UttakSpørsmålKeys> = {
    [Sp.tidsperiode]: {
        isAnswered: ({ periode }) =>
            getValidTidsperiode(periode.tidsperiode as Tidsperiode) !== undefined ||
            (isForeldrepengerFørFødselUttaksperiode(periode) && periode.skalIkkeHaUttakFørTermin === true)
    },
    [Sp.kvote]: {
        isAnswered: ({ periode }) => questionValueIsOk(periode.konto),
        parentQuestion: Sp.tidsperiode,
        condition: ({ kanEndreStønadskonto, velgbareStønadskontotyper }) =>
            kanEndreStønadskonto === true && velgbareStønadskontotyper.length > 0
    },
    [Sp.aktivitetskravMor]: {
        isAnswered: ({ periode }) =>
            periode.type === Periodetype.Uttak &&
            periode.konto === StønadskontoType.Fellesperiode &&
            periode.morsAktivitetIPerioden !== undefined &&
            periode.morsAktivitetIPerioden.length > 0,
        parentQuestion: Sp.tidsperiode,
        condition: (payload) => visAktivitetskravMor(payload)
    },
    [Sp.samtidigUttak]: {
        isAnswered: ({ periode }) =>
            periode.type === Periodetype.Uttak && questionValueIsOk(periode.ønskerSamtidigUttak),
        parentQuestion: Sp.tidsperiode,
        condition: (payload) => visSamtidigUttak(payload)
    },
    [Sp.overføringsårsak]: {
        isAnswered: ({ periode }) => periode.type === Periodetype.Overføring && questionValueIsOk(periode.årsak),
        condition: (payload) =>
            payload.periode.type === Periodetype.Overføring &&
            erUttakEgenKvote(payload.periode.konto, payload.søkerErFarEllerMedmor) === false
    },
    [Sp.overføringsdokumentasjon]: {
        isOptional: () => true,
        isAnswered: ({ periode }) => periode.type === Periodetype.Overføring && questionValueIsOk(periode.årsak),
        condition: (payload) => visOverføringsdokumentasjon(payload)
    },
    [Sp.skalHaGradering]: {
        isAnswered: ({ periode }) => periode.type === Periodetype.Uttak && questionValueIsOk(periode.gradert),
        condition: (payload) => visGradering(payload)
    },
    [Sp.stillingsprosent]: {
        isAnswered: ({ periode }) => periode.type === Periodetype.Uttak && questionValueIsOk(periode.stillingsprosent),
        parentQuestion: Sp.skalHaGradering,
        condition: ({ periode }) => periode.type === Periodetype.Uttak && periode.gradert === true
    },
    [Sp.hvorSkalDuJobbe]: {
        isAnswered: ({ periode }) => periode.type === Periodetype.Uttak && questionValueIsOk(periode.orgnr),
        parentQuestion: Sp.stillingsprosent
    }
};

export const getUttakFormVisibility = (payload: UttakFormPayload): UttakSpørsmålVisibility => {
    return Questions(uttaksperiodeFormConfig).getVisbility(payload);
};
