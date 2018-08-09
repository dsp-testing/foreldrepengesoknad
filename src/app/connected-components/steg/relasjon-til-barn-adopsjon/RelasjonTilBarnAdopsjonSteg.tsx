import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StegID } from '../../../util/routing/stegConfig';
import { DispatchProps } from 'common/redux/types';
import søknadActions from './../../../redux/actions/søknad/søknadActionCreators';
import AntallBarnSpørsmålsgruppe from '../../../spørsmål/AntallBarnSpørsmålsgruppe';
import AdoptertIUtlandetSpørsmål from '../../../spørsmål/AdoptertIUtlandetSpørsmål';
import getMessage from 'common/util/i18nUtils';
import Spørsmål from 'common/components/spørsmål/Spørsmål';
import { Adopsjonsbarn } from '../../../types/søknad/Barn';
import DatoInput from 'common/components/dato-input/DatoInput';
import FødselsdatoerSpørsmål from '../../../spørsmål/FødselsdatoerSpørsmål';
import utils from '../../../util/domain/fødselsdato';
import { AppState } from '../../../redux/reducers';
import Steg, { StegProps } from '../../../components/steg/Steg';
import Bolk from '../../../../common/components/bolk/Bolk';
import { HistoryProps } from '../../../types/common';
import AttachmentsUploaderPure from 'common/storage/attachment/components/AttachmentUploaderPure';
import { Attachment } from 'common/storage/attachment/types/Attachment';
import isAvailable from '../isAvailable';
import { barnErGyldig } from '../../../util/validation/steg/barn';
import { AttachmentType } from '../../../types/søknad/Søknad';
import DateValues from '../../../util/validation/values';
import EkspanderbartInnhold from 'common/components/ekspanderbart-innhold/EkspanderbartInnhold';
import { fødselsdatoerErFyltUt } from '../../../util/validation/fields/f\u00F8dselsdato';

interface StateProps {
    barn: Adopsjonsbarn;
    stegProps: StegProps;
}

type Props = StateProps & InjectedIntlProps & DispatchProps & HistoryProps;
class RelasjonTilBarnAdopsjonSteg extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.oppdaterAntallBarn = this.oppdaterAntallBarn.bind(this);

        if (props.barn.antallBarn) {
            props.dispatch(
                søknadActions.updateBarn({
                    fødselsdatoer: utils.trimFødselsdatoer(
                        props.barn.antallBarn,
                        this.props.barn.fødselsdatoer
                    )
                })
            );
        }
    }

    oppdaterAntallBarn(antall: number) {
        this.props.dispatch(
            søknadActions.updateBarn({
                ...this.props.barn,
                antallBarn: antall,
                fødselsdatoer: utils.trimFødselsdatoer(
                    antall,
                    this.props.barn.fødselsdatoer
                )
            })
        );
    }

    render() {
        const { barn, dispatch, stegProps, intl } = this.props;

        const fødselsdatoerFyltUt = fødselsdatoerErFyltUt(barn.fødselsdatoer);

        const visSpørsmålOmAntallBarn = barn.adopsjonsdato !== undefined;
        const visSpørsmålOmFødselsdatoer =
            visSpørsmålOmAntallBarn && barn.antallBarn !== undefined;
        const visSpørsmålOmAdoptertIUtlandet =
            barn.adoptertIUtlandet !== undefined ||
            (visSpørsmålOmFødselsdatoer && fødselsdatoerFyltUt);
        const visSpørsmålOmVedlegg =
            visSpørsmålOmAdoptertIUtlandet &&
            barn.adoptertIUtlandet !== undefined;

        return (
            <Steg {...stegProps}>
                <Spørsmål
                    render={() => (
                        <DatoInput
                            id="adopsjonsdato"
                            label={getMessage(intl, 'adopsjonsdato.spørsmål')}
                            onChange={(adopsjonsdato: Date) => {
                                dispatch(
                                    søknadActions.updateBarn({
                                        adopsjonsdato
                                    })
                                );
                            }}
                            dato={barn.adopsjonsdato}
                        />
                    )}
                />

                {visSpørsmålOmAntallBarn && (
                    <AntallBarnSpørsmålsgruppe
                        spørsmål={getMessage(
                            intl,
                            'antallBarn.spørsmål.venter'
                        )}
                        inputName="antallBarn"
                        antallBarn={barn.antallBarn}
                        onChange={this.oppdaterAntallBarn}
                    />
                )}

                {visSpørsmålOmFødselsdatoer && (
                    <FødselsdatoerSpørsmål
                        fødselsdatoer={barn.fødselsdatoer || []}
                        fødselsdatoAvgrensninger={{
                            minDato: DateValues.date15YearsAgo.toDate()
                        }}
                        onChange={(fødselsdatoer: Date[]) =>
                            dispatch(
                                søknadActions.updateBarn({
                                    fødselsdatoer
                                })
                            )
                        }
                    />
                )}

                <Spørsmål
                    synlig={visSpørsmålOmAdoptertIUtlandet}
                    render={() => (
                        <AdoptertIUtlandetSpørsmål
                            adoptertIUtlandet={barn.adoptertIUtlandet}
                            onChange={(adoptertIUtlandet) =>
                                dispatch(
                                    søknadActions.updateBarn({
                                        adoptertIUtlandet
                                    })
                                )
                            }
                        />
                    )}
                />

                <EkspanderbartInnhold erApen={visSpørsmålOmVedlegg}>
                    <Bolk
                        tittel={getMessage(
                            intl,
                            'attachments.tittel.omsorgsovertakelse'
                        )}
                        render={() => (
                            <div className="blokkPad-m">
                                <AttachmentsUploaderPure
                                    attachments={
                                        (barn as Adopsjonsbarn)
                                            .omsorgsovertakelse || []
                                    }
                                    attachmentType={
                                        AttachmentType.OMSROGSOVERTAKELSE
                                    }
                                    onFilesSelect={(
                                        attachments: Attachment[]
                                    ) => {
                                        attachments.forEach(
                                            (attachment: Attachment) => {
                                                dispatch(
                                                    søknadActions.uploadAttachment(
                                                        attachment
                                                    )
                                                );
                                            }
                                        );
                                    }}
                                    onFileDelete={(attachment) =>
                                        dispatch(
                                            søknadActions.deleteAttachment(
                                                attachment
                                            )
                                        )
                                    }
                                />
                            </div>
                        )}
                    />
                </EkspanderbartInnhold>
            </Steg>
        );
    }
}

const mapStateToProps = (state: AppState, props: Props): StateProps => {
    const barn = state.søknad.barn as Adopsjonsbarn;

    const stegProps: StegProps = {
        id: StegID.RELASJON_TIL_BARN_ADOPSJON,
        renderFortsettKnapp: barnErGyldig(barn, state.søknad.situasjon),
        history: props.history,
        isAvailable: isAvailable(StegID.RELASJON_TIL_BARN_ADOPSJON, state)
    };

    return {
        barn,
        stegProps
    };
};

export default connect<StateProps, {}, {}>(mapStateToProps)(
    injectIntl(RelasjonTilBarnAdopsjonSteg)
);
