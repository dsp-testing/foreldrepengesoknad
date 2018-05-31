import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import ErBarnetFødtSpørsmål from '../spørsmål/ErBarnetFødtSpørsmål';
import {
    SøkerRolle,
    Søkersituasjon,
    default as Søknad
} from '../types/søknad/Søknad';
import { DispatchProps } from '../redux/types';
import søknadActions from './../redux/actions/søknad/søknadActionCreators';
import apiActions from './../redux/actions/api/apiActionCreators';
import { BarnPartial, UfødtBarn } from '../types/søknad/Barn';
import AntallBarnSpørsmål from '../spørsmål/AntallBarnSpørsmål';
import getMessage from '../util/i18nUtils';
import Spørsmål from '../components/spørsmål/Spørsmål';
import AnnenForelderBolk from '../bolker/AnnenForelderBolk';
import { AnnenForelderPartial } from '../types/søknad/AnnenForelder';
import Bolk from '../components/layout/Bolk';
import DatoInput from '../components/dato-input/DatoInput';
import VæreINorgeVedFødselSpørsmål from '../spørsmål/VæreINorgeVedFødselSpørsmål';
import {
    UtenlandsoppholdPartial,
    UtenlandsoppholdPeriode
} from '../types/søknad/Utenlandsopphold';
import DocumentTitle from 'react-document-title';
import BoddINorgeSiste12MndSpørsmål from '../spørsmål/BoddINorgeSiste12MndSpørsmål';
import SkalBoINorgeNeste12MndSpørsmål from '../spørsmål/SkalBoINorgeNeste12MndSpørsmål';
import ErDuSelvstendigNæringsdrivendeSpørsmål from '../spørsmål/ErDuSelvstendigNæringsdrivendeSpørsmål';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import ErDuFrilanserSpørsmål from '../spørsmål/ErDuFrilanserSpørsmål';
import SøkersituasjonSpørsmål from '../spørsmål/SøkersituasjonSpørsmål';
import SøkerrolleSpørsmål from '../spørsmål/SøkerrolleSpørsmål';
import Applikasjonsside from './sider/Applikasjonsside';
import { getSøkerrollerForBruker } from '../util/søkerrollerUtils';
import { Periode } from 'uttaksplan/types';
import { Språkkode } from '../intl/types';
import Uttaksplan from 'uttaksplan/components/uttaksplan/Uttaksplan';
import UtenlandsoppholdBolk from '../bolker/UtenlandsoppholdBolk';

interface StateProps {
    annenForelder: AnnenForelderPartial;
    barn: BarnPartial;
    situasjon: Søkersituasjon;
    utenlandsopphold: UtenlandsoppholdPartial;
    perioder: Periode[];
    roller?: SøkerRolle[];
    søknad: Søknad;
    språkkode: Språkkode;
}

type Props = StateProps & InjectedIntlProps & DispatchProps;

class Eksempelsøknad extends React.Component<Props> {
    render() {
        const {
            dispatch,
            søknad,
            barn,
            roller,
            situasjon,
            annenForelder,
            utenlandsopphold,
            perioder,
            intl,
            språkkode
        } = this.props;

        return (
            <Applikasjonsside visSpråkvelger={true}>
                <DocumentTitle title="Eksempelsøknad" />

                <Bolk
                    render={() => (
                        <UtenlandsoppholdBolk
                            renderSpørsmål={() => (
                                <SkalBoINorgeNeste12MndSpørsmål
                                    iNorgeNeste12={
                                        utenlandsopphold.iNorgeNeste12Mnd
                                    }
                                    onChange={(iNorgeNeste12Mnd: boolean) =>
                                        dispatch(
                                            søknadActions.updateUtenlandsopphold(
                                                {
                                                    iNorgeNeste12Mnd
                                                }
                                            )
                                        )
                                    }
                                />
                            )}
                            showUtenlandsoppholdPeriodeContent={
                                utenlandsopphold.iNorgeNeste12Mnd === false
                            }
                            oppfølgingsspørsmål="Jeg skal bo i..."
                            perioder={søknad.utenlandsopphold.senerePerioder}
                            periodeType={'siste12mnd'}
                            språk={språkkode}
                            onAddUtenlandsoppholdPeriode={(
                                periode: UtenlandsoppholdPeriode
                            ) =>
                                dispatch(
                                    søknadActions.updateUtenlandsopphold({
                                        senerePerioder: [
                                            ...(utenlandsopphold.senerePerioder ||
                                                []),
                                            periode
                                        ]
                                    })
                                )
                            }
                            onEditUtenlandsoppholdPeriode={(
                                periode: UtenlandsoppholdPeriode,
                                index: number
                            ) => {
                                const senerePerioder =
                                    utenlandsopphold.senerePerioder;
                                if (senerePerioder && index > -1) {
                                    senerePerioder[index] = periode;
                                }
                                dispatch(
                                    søknadActions.updateUtenlandsopphold({
                                        senerePerioder
                                    })
                                );
                            }}
                            onDeleteUtenlandsoppholdPeriode={(
                                periode: UtenlandsoppholdPeriode
                            ) => {
                                const senerePerioder =
                                    utenlandsopphold.senerePerioder;
                                if (senerePerioder) {
                                    senerePerioder.splice(
                                        senerePerioder.indexOf(periode),
                                        1
                                    );
                                    dispatch(
                                        søknadActions.updateUtenlandsopphold({
                                            senerePerioder
                                        })
                                    );
                                }
                            }}
                        />
                    )}
                />

                <Spørsmål
                    render={() => (
                        <SøkersituasjonSpørsmål
                            situasjon={situasjon}
                            onChange={(value) =>
                                dispatch(
                                    søknadActions.updateSøknad({
                                        situasjon: value
                                    })
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={situasjon !== undefined}
                    render={() => (
                        <SøkerrolleSpørsmål
                            rolle={søknad.søkerRolle}
                            roller={roller}
                            onChange={(nyRolle: SøkerRolle) =>
                                dispatch(
                                    søknadActions.updateSøknad({
                                        søkerRolle: nyRolle
                                    })
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={søknad.søkerRolle !== undefined}
                    render={() => (
                        <ErBarnetFødtSpørsmål
                            erBarnetFødt={barn.erBarnetFødt}
                            onChange={(erBarnetFødt: boolean) => {
                                dispatch(
                                    søknadActions.updateBarn({
                                        erBarnetFødt
                                    })
                                );
                            }}
                        />
                    )}
                />

                <Spørsmål
                    synlig={barn.erBarnetFødt !== undefined}
                    render={() => (
                        <AntallBarnSpørsmål
                            antallBarn={barn.antallBarn}
                            inputName="antallBarn"
                            onChange={(antallBarn: number) => {
                                dispatch(
                                    søknadActions.updateBarn({ antallBarn })
                                );
                            }}
                            spørsmål={getMessage(
                                intl,
                                'antallBarn.spørsmål.venter'
                            )}
                        />
                    )}
                />

                <Spørsmål
                    synlig={barn.antallBarn !== undefined}
                    render={() => (
                        <DatoInput
                            id="termindatoinput"
                            label={getMessage(intl, 'termindato.spørsmål')}
                            onChange={(termindato: Date) => {
                                dispatch(
                                    søknadActions.updateBarn({ termindato })
                                );
                            }}
                            dato={(barn as UfødtBarn).termindato}
                        />
                    )}
                />

                <Spørsmål
                    synlig={(barn as UfødtBarn).termindato !== undefined}
                    render={() => (
                        <DatoInput
                            label={getMessage(
                                intl,
                                'terminbekreftelseDato.spørsmål'
                            )}
                            onChange={(terminbekreftelseDato: Date) => {
                                dispatch(
                                    søknadActions.updateBarn({
                                        terminbekreftelseDato
                                    })
                                );
                            }}
                            dato={(barn as UfødtBarn).terminbekreftelseDato}
                            id="termindatoinput"
                        />
                    )}
                />

                <Bolk
                    synlig={
                        (barn as UfødtBarn).terminbekreftelseDato !== undefined
                    }
                    render={() => (
                        <AnnenForelderBolk
                            annenForelderData={annenForelder}
                            onChange={(data: AnnenForelderPartial) =>
                                dispatch(
                                    søknadActions.updateAnnenForelder(data)
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={
                        annenForelder.kanIkkeOppgis ||
                        annenForelder.fnr !== undefined
                    }
                    render={() => (
                        <SkalBoINorgeNeste12MndSpørsmål
                            iNorgeNeste12={utenlandsopphold.iNorgeNeste12Mnd}
                            onChange={(iNorgeNeste12Mnd: boolean) =>
                                dispatch(
                                    søknadActions.updateUtenlandsopphold({
                                        iNorgeNeste12Mnd
                                    })
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={utenlandsopphold.iNorgeNeste12Mnd !== undefined}
                    render={() => (
                        <BoddINorgeSiste12MndSpørsmål
                            iNorgeSiste12={utenlandsopphold.iNorgeSiste12Mnd}
                            onChange={(iNorgeSiste12Mnd: boolean) =>
                                dispatch(
                                    søknadActions.updateUtenlandsopphold({
                                        iNorgeSiste12Mnd
                                    })
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={utenlandsopphold.iNorgeSiste12Mnd !== undefined}
                    render={() => (
                        <VæreINorgeVedFødselSpørsmål
                            fødselINorge={utenlandsopphold.fødselINorge}
                            onChange={(fødselINorge: boolean) =>
                                dispatch(
                                    søknadActions.updateUtenlandsopphold({
                                        fødselINorge
                                    })
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={utenlandsopphold.fødselINorge !== undefined}
                    render={() => (
                        <ErDuSelvstendigNæringsdrivendeSpørsmål
                            erSelvstendigNæringsdrivende={
                                søknad.erSelvstendigNæringsdrivende
                            }
                            onChange={(erSelvstendigNæringsdrivende) =>
                                dispatch(
                                    søknadActions.updateSøknad({
                                        erSelvstendigNæringsdrivende
                                    })
                                )
                            }
                        />
                    )}
                />

                <Spørsmål
                    synlig={utenlandsopphold.fødselINorge !== undefined}
                    render={() => (
                        <ErDuFrilanserSpørsmål
                            erFrilanser={søknad.erFrilanser}
                            onChange={(erFrilanser) =>
                                dispatch(
                                    søknadActions.updateSøknad({
                                        erFrilanser
                                    })
                                )
                            }
                        />
                    )}
                />

                {!barn.erBarnetFødt &&
                    (barn as UfødtBarn).termindato && (
                        <Uttaksplan
                            termindato={(barn as UfødtBarn).termindato}
                            navnForelder1="Mor"
                            navnForelder2={
                                annenForelder && annenForelder.navn
                                    ? annenForelder.navn
                                    : 'Forelder 2'
                            }
                            perioder={perioder}
                            onChange={(p) =>
                                dispatch(
                                    søknadActions.updateSøknad({
                                        uttaksplan: p
                                    })
                                )
                            }
                        />
                    )}

                <Hovedknapp
                    onClick={() => dispatch(apiActions.sendSøknad(søknad))}>
                    Send søknad
                </Hovedknapp>
            </Applikasjonsside>
        );
    }
}

export default connect<StateProps>((state: any) => {
    const { situasjon } = state.søknad;

    const kjønn = state.api.person ? state.api.person.kjønn : undefined;
    const roller =
        kjønn && situasjon
            ? getSøkerrollerForBruker(kjønn, situasjon)
            : undefined;

    return {
        søknad: state.søknad,
        annenForelder: state.søknad.annenForelder,
        barn: state.søknad.barn,
        utenlandsopphold: state.søknad.utenlandsopphold,
        perioder: state.søknad.uttaksplan,
        språkkode: state.common.språkkode,
        situasjon,
        roller
    };
})(injectIntl(Eksempelsøknad));
