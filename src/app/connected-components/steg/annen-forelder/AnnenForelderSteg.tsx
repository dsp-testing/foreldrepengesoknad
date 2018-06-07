import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import AnnenForelderPersonaliaPartial from './partials/AnnenForelderPersonaliaPartial';
import AnnenForelderErKjentPartial from './partials/AnnenForelderErKjentPartial';

import Steg, { StegProps } from '../../../components/layout/Steg';
import { StegID } from '../../../util/stegConfig';

import { AppState } from '../../../redux/reducers';
import { AnnenForelderPartial } from '../../../types/søknad/AnnenForelder';
import { BarnPartial, ForeldreansvarBarn } from '../../../types/søknad/Barn';
import { DispatchProps } from 'common/redux/types';
import { HistoryProps } from '../../../types/common';
import Person from '../../../types/Person';
import Søker, { SøkerPartial } from '../../../types/søknad/Søker';
import { Språkkode } from 'common/intl/types';
import { erFarEllerMedmor } from '../../../util/personUtil';
import { getSøknadsvedlegg } from '../../../util/vedleggUtil';

interface StateProps {
    person: Person;
    barn: BarnPartial;
    søker: Søker;
    annenForelder: AnnenForelderPartial;
    visInformasjonVedOmsorgsovertakelse: boolean;
    språk: Språkkode;
    stegProps: StegProps;
}

// TODO hente reelle data fra API.
const dataOmAndreForelderen = false
    ? {
          navn: 'pent navn',
          fnr: '01010101010',
          alder: '20',
          harOpplystOmSinPågåendeSak: true
      }
    : undefined;

type Props = StateProps & InjectedIntlProps & DispatchProps & HistoryProps;
class AnnenForelderSteg extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    shouldRenderAnnenForelderErKjentPartial() {
        const { annenForelder } = this.props;
        return (
            (annenForelder.navn && annenForelder.fnr) || dataOmAndreForelderen
        );
    }

    render() {
        const {
            person,
            barn,
            søker,
            annenForelder,
            visInformasjonVedOmsorgsovertakelse,
            dispatch,
            språk,
            stegProps
        } = this.props;

        if (person) {
            const erSøkerFarEllerMedmor = erFarEllerMedmor(
                person.kjønn,
                søker.søkerRolle
            );

            return (
                <Steg {...stegProps}>
                    <React.Fragment>
                        <AnnenForelderPersonaliaPartial
                            søker={søker}
                            annenForelder={annenForelder}
                            dataOmAndreForelderen={dataOmAndreForelderen}
                            erFarEllerMedmor={erSøkerFarEllerMedmor}
                            dispatch={dispatch}
                            språk={språk}
                        />
                        {this.shouldRenderAnnenForelderErKjentPartial() && (
                            <AnnenForelderErKjentPartial
                                barn={barn as ForeldreansvarBarn}
                                annenForelder={annenForelder}
                                søker={søker}
                                dataOmAndreForelderen={dataOmAndreForelderen}
                                erFarEllerMedmor={erSøkerFarEllerMedmor}
                                visInformasjonVedOmsorgsovertakelse={
                                    visInformasjonVedOmsorgsovertakelse
                                }
                                dispatch={dispatch}
                            />
                        )}
                    </React.Fragment>
                </Steg>
            );
        }
        return null;
    }
}

const shouldRenderFortsettKnapp = (
    annenForelder: AnnenForelderPartial,
    søker: SøkerPartial,
    omsorgsovertakelseErLastetOpp: boolean,
    søkerErFarEllerMedmor: boolean
) => {
    const annenForelderHarIkkeRettTilFPOgSøkerErMor =
        annenForelder.harRettPåForeldrepenger === false &&
        !søkerErFarEllerMedmor;
    const morErUførSpårsmålErBesvart = annenForelder.erUfør !== undefined;
    const erInformertOmSøknadenSpørsmålBesvart =
        annenForelder.erInformertOmSøknaden !== undefined;
    const medmorEllerFarSkalIkkeHaFP =
        annenForelder.skalHaForeldrepenger === false;
    const medmorEllerFarSkalHaFP = annenForelder.skalHaForeldrepenger === true;
    const harDenAndreForelderenRettPåFPSpørsmålBesvart =
        annenForelder.harRettPåForeldrepenger !== undefined;
    const denAndreForelderenHarOpplystOmSinPågåendeSak =
        dataOmAndreForelderen &&
        dataOmAndreForelderen.harOpplystOmSinPågåendeSak;

    return annenForelder.kanIkkeOppgis ||
        omsorgsovertakelseErLastetOpp ||
        erInformertOmSøknadenSpørsmålBesvart ||
        annenForelderHarIkkeRettTilFPOgSøkerErMor ||
        morErUførSpårsmålErBesvart ||
        medmorEllerFarSkalIkkeHaFP ||
        (medmorEllerFarSkalHaFP &&
            harDenAndreForelderenRettPåFPSpørsmålBesvart) ||
        (denAndreForelderenHarOpplystOmSinPågåendeSak && !søkerErFarEllerMedmor)
        ? true
        : false;
};

const mapStateToProps = (state: AppState, props: Props): StateProps => {
    const person = state.api.person as Person;
    const barn = state.søknad.barn;
    const søker = state.søknad.søker;
    const annenForelder = state.søknad.annenForelder;
    const språk = state.common.språkkode;

    const stegProps = {
        id: StegID.RELASJON_TIL_BARN_ADOPSJON,
        renderFortsettKnapp:
            person === undefined
                ? false
                : shouldRenderFortsettKnapp(
                      annenForelder,
                      søker,
                      getSøknadsvedlegg('omsorgsovertakelse', state).length > 0,
                      erFarEllerMedmor(person.kjønn, søker.søkerRolle)
                  ),
        history: props.history
    };

    return {
        stegProps,
        person,
        barn,
        søker,
        annenForelder,
        visInformasjonVedOmsorgsovertakelse:
            getSøknadsvedlegg('omsorgsovertakelse', state).length > 0,
        språk
    };
};

export default connect<StateProps, {}, {}>(mapStateToProps)(
    injectIntl(AnnenForelderSteg)
);
