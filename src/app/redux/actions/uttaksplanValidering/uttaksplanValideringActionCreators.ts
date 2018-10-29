import {
    UttaksplanValideringActionKeys,
    UttaksplanValideringActionTypes
} from './uttaksplanValideringActionDefinitions';
import { Periodevalidering } from '../../reducers/uttaksplanValideringReducer';
import { Stønadskontouttak } from '../../../components/uttaksoppsummering/Uttaksoppsummering';

export function setUttaksplanValidering(
    validertePerioder: Periodevalidering,
    inneholderPerioder: boolean,
    stønadskontoerMedForMyeUttak: Stønadskontouttak[],
    førsteUttakErInnenforSeksUker: boolean,
    morHarSøktUgyldigUtsettelseFørsteSeksUker: boolean,
    farHarSøktUgyldigUtsettelseFørsteSeksUker: boolean,
    uttaksmengdeForFarMedmorForHøy: boolean
): UttaksplanValideringActionTypes {
    return {
        type: UttaksplanValideringActionKeys.SET_UTTAKSPLAN_VALIDERING,
        validertePerioder,
        inneholderPerioder,
        stønadskontoerMedForMyeUttak,
        førsteUttakErInnenforSeksUker,
        morHarSøktUgyldigUtsettelseFørsteSeksUker,
        farHarSøktUgyldigUtsettelseFørsteSeksUker,
        uttaksmengdeForFarMedmorForHøy
    };
}

export function validerUttaksplanAction() {
    return {
        type: UttaksplanValideringActionKeys.VALIDER_UTTAKSPLAN
    };
}

export default {
    setUttaksplanValidering,
    validerUttaksplanAction
};
