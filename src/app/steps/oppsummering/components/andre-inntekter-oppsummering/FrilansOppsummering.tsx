import { Block, formatDate, intlUtils } from '@navikt/fp-common';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import useSøknad from 'app/utils/hooks/useSøknad';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import OppsummeringsPunkt from '../OppsummeringsPunkt';

import './frilansOppsummering.less';

const FrilansOppsummering: FunctionComponent = () => {
    const intl = useIntl();
    const {
        søker: { frilansInformasjon, harJobbetSomFrilansSiste10Mnd },
    } = useSøknad();

    if (!frilansInformasjon || !harJobbetSomFrilansSiste10Mnd) {
        return (
            <OppsummeringsPunkt title={intlUtils(intl, 'oppsummering.frilans.tittel')}>
                <Normaltekst>{intlUtils(intl, 'oppsummering.frilans.ikkeFrilans')}</Normaltekst>
            </OppsummeringsPunkt>
        );
    }
    const {
        oppstart,
        jobberFremdelesSomFrilans,
        driverFosterhjem,
        harJobbetForNærVennEllerFamilieSiste10Mnd,
        oppdragForNæreVennerEllerFamilieSiste10Mnd,
    } = frilansInformasjon;

    return (
        <>
            <OppsummeringsPunkt title={intlUtils(intl, 'oppsummering.frilans.tittel')} />
            <OppsummeringsPunkt title={intlUtils(intl, 'oppsummering.frilans.oppstartsdato')}>
                <Normaltekst>{formatDate(ISOStringToDate(oppstart)!)}</Normaltekst>
            </OppsummeringsPunkt>
            <OppsummeringsPunkt title={intlUtils(intl, 'oppsummering.frilans.fremdelesFrilans')}>
                <Normaltekst>{jobberFremdelesSomFrilans ? intlUtils(intl, 'ja') : intlUtils(intl, 'nei')}</Normaltekst>
            </OppsummeringsPunkt>
            <OppsummeringsPunkt title={intlUtils(intl, 'oppsummering.frilans.driverFosterhjem')}>
                <Normaltekst>{driverFosterhjem ? intlUtils(intl, 'ja') : intlUtils(intl, 'nei')}</Normaltekst>
            </OppsummeringsPunkt>
            <OppsummeringsPunkt
                title={intlUtils(intl, 'oppsummering.frilans.frilansArbeidForNæreVennerEllerFamilieSiste10Mnd')}
            >
                <Block visible={!harJobbetForNærVennEllerFamilieSiste10Mnd} margin="none">
                    <Normaltekst>
                        {intlUtils(
                            intl,
                            'oppsummering.frilans.harIkkeUtførtFrilansArbeidForNæreVennerEllerFamilieSiste10Mnd'
                        )}
                    </Normaltekst>
                </Block>
                <Block visible={harJobbetForNærVennEllerFamilieSiste10Mnd} margin="none">
                    <ul className="oppsummeringsliste">
                        {oppdragForNæreVennerEllerFamilieSiste10Mnd.map(
                            ({ navnPåArbeidsgiver, tidsperiode, pågående }) => (
                                <li key={navnPåArbeidsgiver + tidsperiode} className="oppsummeringsliste__element">
                                    <div className="oppsummeringsliste__element__heading">
                                        <Element>{navnPåArbeidsgiver}</Element>
                                        <div className="høyrestiltTekst">
                                            {intlUtils(intl, 'tidsintervall', {
                                                fom: formatDate(ISOStringToDate(tidsperiode.fom)!),
                                                tom: pågående
                                                    ? 'pågående'
                                                    : formatDate(ISOStringToDate(tidsperiode.tom)!),
                                            })}
                                        </div>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                </Block>
            </OppsummeringsPunkt>
        </>
    );
};

export default FrilansOppsummering;
