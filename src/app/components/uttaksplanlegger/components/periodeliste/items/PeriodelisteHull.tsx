import * as React from 'react';
import { onToggleItemProp } from '../../../../elementer/toggleList/ToggleList';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';
import getMessage from 'common/util/i18nUtils';
import { PeriodeHull, isAvslåttPeriode, AvslåttPeriode } from '../../../../../types/uttaksplan/periodetyper';
import { Tidsperiode, NavnPåForeldre } from 'common/types';
import { Tidsperioden } from '../../../../../util/uttaksplan/Tidsperioden';
import Knapperad from 'common/components/knapperad/Knapperad';
import PeriodelisteInfo from './PeriodelisteInfo';
import Block from 'common/components/block/Block';
import { getVarighetString } from 'common/util/intlUtils';
import { getStønadskontoNavn } from 'app/util/uttaksplan';
import LinkButton from 'app/components/elementer/linkButton/LinkButton';
import UttaksplanAdvarselIkon from 'app/components/ikoner/uttaksplanIkon/ikoner/AdvarselIkon';
import { NavnISøknaden } from 'app/selectors/types';
import { førsteOktober2021ReglerGjelder } from 'app/util/dates/dates';

export interface Props {
    itemId: string;
    isExpanded: boolean;
    onToggle: onToggleItemProp;
    periode: PeriodeHull | AvslåttPeriode;
    navn: NavnISøknaden;
    onReplaceHullWithPeriode?: (tidsperiode: Tidsperiode) => void;
    onReplaceHullWithOpphold?: (tidsperiode: Tidsperiode) => void;
    erDeltUttak: boolean;
    intl: IntlShape;
    familiehendelsesdato: Date;
    erFarEllerMedmor: boolean;
    erAleneOmOmsorg: boolean;
}

const getTittelOgBeskrivelseForHull = (
    periode: PeriodeHull | AvslåttPeriode,
    dager: number,
    navnPåForeldre: NavnPåForeldre,
    intl: IntlShape
): { tittel: string; beskrivelse: string } => {
    if (isAvslåttPeriode(periode)) {
        return {
            tittel: getMessage(intl, 'periodeliste.ikkeInnvilgetPeriode.tittel', {
                type: getMessage(intl, `periodetype.${periode.avslåttPeriodeType}`),
            }),
            beskrivelse: getMessage(intl, 'periodeliste.ikkeInnvilgetPeriode.beskrivelse', {
                varighet: getVarighetString(dager, intl),
                konto: getStønadskontoNavn(intl, periode.stønadskonto, navnPåForeldre),
            }),
        };
    }
    return {
        tittel: getMessage(intl, 'periodeliste.hull.tittel'),
        beskrivelse: getMessage(intl, 'periodeliste.hull.beskrivelse', { dager }),
    };
};

const PeriodelisteHullItem: React.FunctionComponent<Props> = ({
    itemId,
    isExpanded,
    onToggle,
    periode,
    onReplaceHullWithPeriode,
    onReplaceHullWithOpphold,
    navn,
    erDeltUttak,
    familiehendelsesdato,
    erFarEllerMedmor,
    erAleneOmOmsorg,
    intl,
}) => {
    const antallDager = Tidsperioden(periode.tidsperiode).getAntallUttaksdager();
    const antallHelligdager = Tidsperioden(periode.tidsperiode).getAntallFridager();
    const antallUttaksdager = Tidsperioden(periode.tidsperiode).getAntallUttaksdager();
    const kunHelligdager = antallHelligdager === antallUttaksdager;
    const kunUttaksdager = antallHelligdager === 0;

    const knapper: React.ReactNode[] = [];
    if (onReplaceHullWithPeriode) {
        knapper.unshift(
            <LinkButton key="periode" onClick={() => onReplaceHullWithPeriode(periode.tidsperiode)}>
                {getMessage(intl, 'uttaksplan.hull.leggTil.uttak')}
            </LinkButton>
        );
    }

    if (onReplaceHullWithOpphold) {
        knapper.unshift(
            <LinkButton key="opphold" onClick={() => onReplaceHullWithOpphold(periode.tidsperiode)}>
                {getMessage(intl, 'uttaksplan.hull.leggTil.opphold')}
            </LinkButton>
        );
    }

    const { tittel, beskrivelse } = getTittelOgBeskrivelseForHull(periode, antallDager, navn.navnPåForeldre, intl);
    const nyeRegler = førsteOktober2021ReglerGjelder(familiehendelsesdato);

    return (
        <PeriodelisteInfo
            id={itemId}
            tittel={erDeltUttak ? '' : tittel}
            isExpanded={isExpanded}
            onToggle={onToggle}
            beskrivelse={beskrivelse}
            ikon={<UttaksplanAdvarselIkon />}
            annenForelderSamtidigUttakPeriode={undefined}
            tidsperiode={periode.tidsperiode}
            renderContent={() => (
                <div>
                    {isAvslåttPeriode(periode) ? (
                        <Block>
                            <FormattedMessage
                                id={`periodeliste.ikkeInnvilgetPeriode.expanded.beskrivelse.${periode.avslåttPeriodeType}`}
                            />
                        </Block>
                    ) : (
                        <>
                            <Block margin="xs" visible={kunHelligdager}>
                                <FormattedMessage id="periodeliste.hull.info.helligdager" />
                            </Block>
                            <Block margin="xs" visible={kunUttaksdager}>
                                {erDeltUttak ? (
                                    <FormattedMessage
                                        id="periodeliste.hull.info.uttaksdager.deltUttak"
                                        values={{
                                            navn: navn.annenForelder.fornavn,
                                            dager: antallDager,
                                        }}
                                    />
                                ) : (
                                    <FormattedMessage
                                        id={
                                            nyeRegler && erFarEllerMedmor && !erAleneOmOmsorg
                                                ? 'periodeliste.hull.info.uttaksdager.ikkeDeltUttak.nyeRegler'
                                                : 'periodeliste.hull.info.uttaksdager.ikkeDeltUttak'
                                        }
                                        values={{
                                            dager: antallDager,
                                        }}
                                    />
                                )}
                            </Block>
                            <Block margin="xs" visible={kunUttaksdager === false && kunHelligdager === false}>
                                {erDeltUttak ? (
                                    <FormattedMessage
                                        id="periodeliste.hull.info.helligdagerOgUttaksdager.deltUttak"
                                        values={{
                                            navn: navn.annenForelder.fornavn,
                                            dager: antallDager,
                                        }}
                                    />
                                ) : (
                                    <FormattedMessage
                                        id="periodeliste.hull.info.helligdagerOgUttaksdager.ikkeDeltUttak"
                                        values={{
                                            dager: antallDager,
                                        }}
                                    />
                                )}
                            </Block>
                        </>
                    )}

                    <Knapperad align="left">{knapper}</Knapperad>
                </div>
            )}
        />
    );
};

export default injectIntl(PeriodelisteHullItem);
