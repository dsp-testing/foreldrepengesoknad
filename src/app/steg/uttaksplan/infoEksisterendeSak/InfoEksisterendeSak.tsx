import * as React from 'react';
import {
    TilgjengeligStønadskonto,
    Periodetype,
    InfoPeriode,
    PeriodeInfoType
} from '../../../types/uttaksplan/periodetyper';
import { getAntallUker } from '../../../util/uttaksplan/stønadskontoer';
import { injectIntl, InjectedIntlProps, InjectedIntl, FormattedHTMLMessage } from 'react-intl';
import SituasjonSirkel from './illustrasjoner/situasjonSirkel/SituasjonSirkel';
import UkerSirkel from './illustrasjoner/ukerSirkel/UkerSirkel';
import { Søknadsinfo, NavnISøknaden } from 'app/selectors/types';
import getMessage from 'common/util/i18nUtils';
import { Forelder } from 'common/types';
import InfoBlock from 'common/components/infoBlock/InfoBlock';
import InnholdMedIllustrasjon from 'app/components/elementer/innholdMedIllustrasjon/InnholdMedIllustrasjon';
import { getVarighetString } from 'common/util/intlUtils';
import UtvidetInformasjon from 'app/components/elementer/utvidetinformasjon/UtvidetInformasjon';
import { EksisterendeSak } from 'app/types/EksisterendeSak';
import InfoEksisterendeSakPerioder from './InfoEksisterendeSakPerioder';
import { Normaltekst } from 'nav-frontend-typografi';
import { Periodene } from 'app/util/uttaksplan/Periodene';
import { formaterDato } from 'common/util/datoUtils';
import { Uttaksdagen } from 'app/util/uttaksplan/Uttaksdagen';
import { getNavnGenitivEierform } from 'app/util/tekstUtils';
import { trimPerioderIGruppertInfoPeriode } from 'app/util/uttaksplan/gruppertInfoPeriodeUtils';
import { getForeldreparSituasjonFraSøknadsinfo } from 'app/util/foreldreparSituasjonUtils';

interface OwnProps {
    søknadsinfo: Søknadsinfo;
    tilgjengeligeStønadskontoer: TilgjengeligStønadskonto[];
    eksisterendeSak: EksisterendeSak;
    skalKunneViseInfoOmEkisterendeSak?: boolean;
}

type Props = InjectedIntlProps & OwnProps;

const getHvem = (
    intl: InjectedIntl,
    erDeltUttak: boolean,
    navn?: NavnISøknaden,
    erAnnenPartsEksisterendeSak?: boolean
): string => {
    if (erDeltUttak && navn && navn.annenForelder) {
        return erAnnenPartsEksisterendeSak
            ? getMessage(intl, 'eksisterendeSak.tekst.benevning.førstegangssøknaMedEkisterndeSakAnnenPart', {
                  navn: navn.annenForelder.fornavn
              })
            : getMessage(intl, 'eksisterendeSak.tekst.benevning.deltOmsorg', { navn: navn.annenForelder.fornavn });
    }
    return getMessage(intl, 'eksisterendeSak.tekst.benevning.aleneomsorg');
};

const InfoEksisterendeSak: React.StatelessComponent<Props> = ({
    søknadsinfo,
    tilgjengeligeStønadskontoer,
    eksisterendeSak,
    skalKunneViseInfoOmEkisterendeSak = false,
    intl
}) => {
    const uker = getAntallUker(tilgjengeligeStønadskontoer);
    const situasjon = getForeldreparSituasjonFraSøknadsinfo(søknadsinfo);
    if (situasjon === undefined) {
        return null;
    }
    const {
        søknaden: { erDeltUttak, dekningsgrad },
        navn
    } = søknadsinfo;

    const forelderVedAleneomsorg = erDeltUttak
        ? undefined
        : søknadsinfo.søker.erMor
            ? Forelder.mor
            : Forelder.farMedmor;

    const hvem = getHvem(intl, erDeltUttak, navn, eksisterendeSak.erAnnenPartsSak);

    const sisteInfoPeriode = eksisterendeSak.uttaksplan
        ? Periodene(eksisterendeSak.uttaksplan).finnSisteInfoperiode()
        : undefined;
    const nesteMuligeUttaksdagEtterAnnenPart =
        eksisterendeSak && eksisterendeSak.uttaksplan && sisteInfoPeriode
            ? Uttaksdagen(sisteInfoPeriode.tidsperiode.tom).neste()
            : undefined;

    const navnGenitivEierform = getNavnGenitivEierform(navn.annenForelder.fornavn, intl.locale);

    const infoperioder: InfoPeriode[] = [];
    if (eksisterendeSak && eksisterendeSak.uttaksplan) {
        eksisterendeSak.uttaksplan.filter((p) => p.type === Periodetype.Info).forEach((p: InfoPeriode) => {
            if (p.infotype === PeriodeInfoType.gruppertInfo) {
                return infoperioder.push(...trimPerioderIGruppertInfoPeriode(p));
            }
            return infoperioder.push(p);
        });
    }

    const søkersPerioder =
        eksisterendeSak &&
        eksisterendeSak.uttaksplan &&
        eksisterendeSak.uttaksplan.filter((p) => p.type !== Periodetype.Info);

    return (
        <InfoBlock padding="m">
            <InnholdMedIllustrasjon
                tittel={getMessage(intl, `eksisterendeSak.tittel.${erDeltUttak ? 'deltUttak' : 'aleneomsorg'}`)}
                illustrasjoner={[
                    <SituasjonSirkel key="situasjon" situasjon={situasjon} valgtForelder={forelderVedAleneomsorg} />,
                    <UkerSirkel key="uker" uker={uker} />
                ]}>
                <Normaltekst>
                    <FormattedHTMLMessage
                        id="eksisterendeSak.tekst.html"
                        values={{
                            uker: getVarighetString(uker * 5, intl),
                            dekningsgrad,
                            navn: hvem
                        }}
                    />
                </Normaltekst>
                {skalKunneViseInfoOmEkisterendeSak &&
                    nesteMuligeUttaksdagEtterAnnenPart && (
                        <Normaltekst>
                            <FormattedHTMLMessage
                                id="eksisterendeSak.tekst.nesteMuligeUttaksdato"
                                values={{
                                    dato: formaterDato(nesteMuligeUttaksdagEtterAnnenPart, 'DD. MMM YYYY'),
                                    navn: navn.annenForelder.fornavn
                                }}
                            />
                        </Normaltekst>
                    )}

                {skalKunneViseInfoOmEkisterendeSak &&
                    infoperioder &&
                    infoperioder.length > 0 && (
                        <UtvidetInformasjon
                            apneLabel={getMessage(intl, 'eksisterendeSak.label.seAnnenPartsPlan', {
                                navn: navnGenitivEierform
                            })}>
                            <InfoEksisterendeSakPerioder
                                perioder={infoperioder}
                                søknadsinfo={søknadsinfo}
                                navnForOverskrift={søknadsinfo.navn.annenForelder.navn}
                            />
                        </UtvidetInformasjon>
                    )}
            </InnholdMedIllustrasjon>
            {skalKunneViseInfoOmEkisterendeSak &&
                søkersPerioder &&
                søkersPerioder.length > 0 && (
                    <InnholdMedIllustrasjon
                        tittel={getMessage(intl, 'eksisterendeSak.tittel.dineDagerMedForeldrepenger')}
                        illustrasjoner={[]}>
                        <InfoEksisterendeSakPerioder perioder={søkersPerioder} søknadsinfo={søknadsinfo} />
                    </InnholdMedIllustrasjon>
                )}
        </InfoBlock>
    );
};

export default injectIntl(InfoEksisterendeSak);
