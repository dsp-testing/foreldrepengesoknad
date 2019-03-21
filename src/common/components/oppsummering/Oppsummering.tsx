import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import getMessage from 'common/util/i18nUtils';
import Søknad from '../../../app/types/søknad/Søknad';
import SøkerPersonalia from 'common/components/søker-personalia/SøkerPersonalia';
import { getErSøkerFarEllerMedmor, formaterNavn } from 'app/util/domain/personUtil';
import { Søkerinfo } from '../../../app/types/søkerinfo';
import { skalSøkerLasteOppTerminbekreftelse } from '../../../app/util/validation/steg/barn';
import Block from 'common/components/block/Block';
import AnnenForelderOppsummering from 'common/components/oppsummering/oppsummeringer/AnnenForelderOppsummering';
import RelasjonTilBarnOppsummering from 'common/components/oppsummering/oppsummeringer/RelasjonTilBarnOppsummering';
import UtenlandsoppholdOppsummering from 'common/components/oppsummering/oppsummeringer/UtenlandsoppholdOppsummering';
import InntektOppsummering from 'common/components/oppsummering/oppsummeringer/InntektOppsummering';
import Oppsummeringspanel from 'common/components/oppsummeringspanel/Oppsummeringspanel';
import UttaksplanOppsummering from 'common/components/oppsummering/oppsummeringer/UttaksplanOppsummering';
import { getFamiliehendelsedato, getNavnPåForeldre } from '../../../app/util/uttaksplan';
import { UttaksplanValideringState } from 'app/redux/reducers/uttaksplanValideringReducer';

import './oppsummering.less';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veileder from '../veileder/Veileder';
import VeilederpanelInnhold from 'app/components/veilederpanel-innhold/VeilederpanelInnhold';
import { Søknadsinfo } from 'app/selectors/types';

interface OppsummeringProps {
    søkerinfo: Søkerinfo;
    søknad: Søknad;
    uttaksplanValidering: UttaksplanValideringState;
    antallUkerUttaksplan: number;
    søknadsinfo: Søknadsinfo;
}

type Props = OppsummeringProps & InjectedIntlProps;
class Oppsummering extends React.Component<Props> {
    render() {
        const { søkerinfo, søknad, uttaksplanValidering, antallUkerUttaksplan, søknadsinfo, intl } = this.props;
        const { person } = søkerinfo;
        return (
            <Block margin="m">
                {uttaksplanValidering.erGyldig && (
                    <Veilederpanel kompakt={true} svg={<Veileder stil="kompakt-uten-bakgrunn" />}>
                        <VeilederpanelInnhold
                            messages={[
                                {
                                    type: 'normal',
                                    contentIntlKey: 'oppsummering.veileder'
                                }
                            ]}
                        />
                    </Veilederpanel>
                )}
                <div className="oppsummering">
                    <Block margin="s">
                        <SøkerPersonalia
                            navn={formaterNavn(person.fornavn, person.etternavn, person.mellomnavn)}
                            fnr={person.fnr}
                            kjønn={person.kjønn}
                        />
                    </Block>

                    <Oppsummeringspanel
                        tittel={getMessage(intl, 'oppsummering.relasjonTilBarn')}
                        tittelProps="undertittel">
                        <RelasjonTilBarnOppsummering
                            barn={søknad.barn}
                            annenForelder={søknad.annenForelder}
                            situasjon={this.props.søknad.situasjon}
                            skalLasteOppTerminbekreftelse={skalSøkerLasteOppTerminbekreftelse(søknad, søkerinfo)}
                        />
                    </Oppsummeringspanel>

                    <Oppsummeringspanel
                        tittel={getMessage(intl, 'oppsummering.annenForelder')}
                        tittelProps="undertittel">
                        <AnnenForelderOppsummering
                            annenForelder={søknad.annenForelder}
                            erAleneOmOmsorg={søknad.søker.erAleneOmOmsorg}
                            barn={søknad.barn}
                            erFarEllerMedmor={getErSøkerFarEllerMedmor(søknad.søker.rolle)}
                        />
                    </Oppsummeringspanel>

                    {søknad.erEndringssøknad === false && (
                        <>
                            <Oppsummeringspanel
                                tittel={getMessage(intl, 'oppsummering.utenlandsopphold')}
                                tittelProps="undertittel">
                                <UtenlandsoppholdOppsummering
                                    informasjonOmUtenlandsopphold={søknad.informasjonOmUtenlandsopphold}
                                    situasjon={søknad.situasjon}
                                    familiehendelsedato={getFamiliehendelsedato(søknad.barn, søknad.situasjon)}
                                    farEllerMedmor={getErSøkerFarEllerMedmor(søknad.søker.rolle)}
                                />
                            </Oppsummeringspanel>

                            <Oppsummeringspanel
                                tittel={getMessage(intl, 'oppsummering.inntekt')}
                                tittelProps="undertittel">
                                <InntektOppsummering søker={søknad.søker} arbeidsforhold={søkerinfo.arbeidsforhold} />
                            </Oppsummeringspanel>
                        </>
                    )}

                    <Oppsummeringspanel tittel={getMessage(intl, 'oppsummering.uttak')} tittelProps="undertittel">
                        <UttaksplanOppsummering
                            perioder={søknad.uttaksplan}
                            navnPåForeldre={getNavnPåForeldre(søknad, søkerinfo.person)}
                            annenForelder={søknad.annenForelder}
                            erFarEllerMedmor={getErSøkerFarEllerMedmor(søknad.søker.rolle)}
                            registrerteArbeidsforhold={søkerinfo.arbeidsforhold}
                            uttaksplanValidering={uttaksplanValidering}
                            dekningsgrad={søknad.dekningsgrad}
                            antallUkerUttaksplan={antallUkerUttaksplan}
                            begrunnelseForSenEndring={søknad.tilleggsopplysninger.begrunnelseForSenEndring}
                            begrunnelseForSenEndringVedlegg={søknad.vedleggForSenEndring}
                            søknadsinfo={søknadsinfo}
                        />
                    </Oppsummeringspanel>
                </div>
            </Block>
        );
    }
}
export default injectIntl(Oppsummering);
