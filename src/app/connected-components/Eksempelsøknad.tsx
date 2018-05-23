import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import ErDuMedmorSpørsmål from '../spørsmål/ErDuMedmorSpørsmål';
import ErBarnetFødtSpørsmål from '../spørsmål/ErBarnetFødtSpørsmål';
import {
    SøkerRolle,
    Søkersituasjon,
    SøkerPartial
} from '../types/søknad/Søknad';
import { DispatchProps } from '../redux/types';
import søknadActions from './../redux/actions/søknad/søknadActionCreators';
import { UfødtBarn, BarnPartial } from '../types/søknad/Barn';
import AntallBarnSpørsmål from '../spørsmål/AntallBarnSpørsmål';
import getMessage from '../util/i18nUtils';
import Spørsmål from '../components/spørsmål/Spørsmål';
import AnnenForelderBolk from '../bolker/AnnenForelderBolk';
import { AnnenForelderPartial } from '../types/søknad/AnnenForelder';
import Bolk from '../components/layout/Bolk';
import DatoInput from '../components/dato-input/DatoInput';
import SøkersituasjonSpørsmål from '../spørsmål/SøkersituasjonSpørsmål';
import VæreINorgeVedFødselSpørsmål from '../spørsmål/VæreINorgeVedFødselSpørsmål';
import { UtenlandsoppholdPartial } from '../types/søknad/Utenlandsopphold';
import DocumentTitle from 'react-document-title';
import Applikasjonsside from './sider/Applikasjonsside';
import UttaksplanEksempelskjema from 'uttaksplan/components/uttaksplan/UttaksplanEksempelskjema';
import BoddINorgeSiste12MndSpørsmål from '../spørsmål/BoddINorgeSiste12MndSpørsmål';
import SkalBoINorgeNeste12MndSpørsmål from '../spørsmål/SkalBoINorgeNeste12MndSpørsmål';
import { Periode } from 'uttaksplan/types';
import { AppState } from '../redux/reducers';

interface StateProps {
    annenForelder?: AnnenForelderPartial;
    barn?: BarnPartial;
    søker?: SøkerPartial;
    situasjon?: Søkersituasjon;
    utenlandsopphold?: UtenlandsoppholdPartial;
    perioder?: Periode[];
}

type Props = StateProps & InjectedIntlProps & DispatchProps;

class Eksempelsøknad extends React.Component<Props> {
    render() {
        const {
            dispatch,
            søker,
            barn,
            situasjon,
            annenForelder,
            utenlandsopphold,
            perioder,
            intl
        } = this.props;

        return (
            <Applikasjonsside visSpråkvelger={true}>
                <DocumentTitle title="Eksempelsøknad" />
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
                    synlig={situasjon === Søkersituasjon.ADOPSJON}
                    render={() =>
                        søker !== undefined ? (
                            <ErDuMedmorSpørsmål
                                erMedmor={søker.rolle as string}
                                onChange={(rolle: SøkerRolle) =>
                                    dispatch(
                                        søknadActions.updateSøker({ rolle })
                                    )
                                }
                            />
                        ) : (
                            undefined
                        )
                    }
                />

                <Spørsmål
                    synlig={søker && søker.rolle !== undefined}
                    render={() =>
                        barn !== undefined ? (
                            <ErBarnetFødtSpørsmål
                                erBarnetFødt={barn.erBarnetFødt}
                                onChange={(erBarnetFødt: boolean) => {
                                    dispatch(
                                        søknadActions.updateBarn({
                                            erBarnetFødt: erBarnetFødt === true
                                        })
                                    );
                                }}
                            />
                        ) : (
                            undefined
                        )
                    }
                />

                <Spørsmål
                    synlig={barn && barn.erBarnetFødt !== undefined}
                    render={() =>
                        barn !== undefined ? (
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
                        ) : (
                            undefined
                        )
                    }
                />

                <Spørsmål
                    synlig={barn && barn.antallBarn !== undefined}
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
                    render={() =>
                        annenForelder !== undefined ? (
                            <AnnenForelderBolk
                                annenForelderData={annenForelder}
                                onChange={(data: AnnenForelderPartial) =>
                                    dispatch(
                                        søknadActions.updateAnnenForelder(data)
                                    )
                                }
                            />
                        ) : (
                            undefined
                        )
                    }
                />

                <Spørsmål
                    synlig={
                        annenForelder &&
                        (annenForelder.kanIkkeOppgis ||
                            annenForelder.fnr !== undefined)
                    }
                    render={() =>
                        annenForelder !== undefined &&
                        utenlandsopphold !== undefined ? (
                            <SkalBoINorgeNeste12MndSpørsmål
                                iNorgeNeste12={
                                    utenlandsopphold.iNorgeNeste12Mnd
                                }
                                onChange={(iNorgeNeste12Mnd: boolean) =>
                                    dispatch(
                                        søknadActions.updateUtenlandsopphold({
                                            iNorgeNeste12Mnd:
                                                utenlandsopphold.iNorgeNeste12Mnd ===
                                                true
                                        })
                                    )
                                }
                            />
                        ) : (
                            undefined
                        )
                    }
                />

                <Spørsmål
                    synlig={
                        utenlandsopphold &&
                        utenlandsopphold.iNorgeNeste12Mnd !== undefined
                    }
                    render={() =>
                        utenlandsopphold !== undefined ? (
                            <BoddINorgeSiste12MndSpørsmål
                                iNorgeSiste12={
                                    utenlandsopphold.iNorgeSiste12Mnd
                                }
                                onChange={(iNorgeSiste12Mnd: boolean) =>
                                    dispatch(
                                        søknadActions.updateUtenlandsopphold({
                                            iNorgeSiste12Mnd:
                                                iNorgeSiste12Mnd === true
                                        })
                                    )
                                }
                            />
                        ) : (
                            undefined
                        )
                    }
                />

                <Spørsmål
                    synlig={
                        utenlandsopphold &&
                        utenlandsopphold.iNorgeSiste12Mnd !== undefined
                    }
                    render={() =>
                        utenlandsopphold ? (
                            <VæreINorgeVedFødselSpørsmål
                                fødselINorge={
                                    utenlandsopphold.fødselINorge === true
                                }
                                onChange={(fødselINorge: boolean) =>
                                    dispatch(
                                        søknadActions.updateUtenlandsopphold({
                                            fødselINorge
                                        })
                                    )
                                }
                            />
                        ) : (
                            undefined
                        )
                    }
                />
                {barn &&
                    !barn.erBarnetFødt &&
                    (barn as UfødtBarn).termindato && (
                        <UttaksplanEksempelskjema
                            termindato={(barn as UfødtBarn).termindato}
                            dekningsgrad="100%"
                            navnForelder1="Mor"
                            navnForelder2={
                                annenForelder && annenForelder.navn
                                    ? annenForelder.navn
                                    : 'Forelder 2'
                            }
                            perioder={perioder}
                            onLagPerioder={(p) =>
                                dispatch(
                                    søknadActions.updateSøknad({
                                        uttaksplan: p
                                    })
                                )
                            }
                        />
                    )}
            </Applikasjonsside>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    annenForelder: state.søknad.annenForelder,
    barn: state.søknad.barn,
    søker: state.søknad.søker,
    situasjon: state.søknad.situasjon,
    utenlandsopphold: state.søknad.utenlandsopphold,
    perioder: state.søknad.uttaksplan
});

export default connect(mapStateToProps)(injectIntl(Eksempelsøknad));
