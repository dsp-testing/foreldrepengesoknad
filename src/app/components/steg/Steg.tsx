import * as React from 'react';
import stegConfig, {
    StegID,
    StegIDConfig,
    StegConfig
} from '../../util/routing/stegConfig';
import { History } from 'history';
import FortsettKnapp from 'common/components/fortsett-knapp/FortsettKnapp';
import ValidForm from 'common/lib/validation/ValidForm';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import getMessage from 'common/util/i18nUtils';
import { søknadStegPath } from '../../connected-components/steg/StegRoutes';
import StegHeader from '../steg-header/StegHeader';
import './steg.less';

export interface StegProps {
    id: StegID;
    renderFortsettKnapp?: boolean;
    history: History;
    onSubmit?: () => void;
}

type Props = StegProps & InjectedIntlProps;

class Steg extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnSubmit() {
        const { id, history } = this.props;
        this.props.onSubmit
            ? this.props.onSubmit()
            : history.push(`${søknadStegPath(stegConfig[id].nesteSteg)}`);
    }

    buildStegindikatorSteg(config: StegConfig) {
        const ret = Object.values(config)
            .reduce((x: StegIDConfig[], y: StegIDConfig) => {
                if (!x.find((j) => j.index === y.index)) {
                    x.push(y);
                }
                return x;
            }, [])
            .map((stegConfigItem) => ({
                label: stegConfigItem.tittel,
                index: stegConfigItem.index
            }));
        return ret;
    }

    render() {
        const { id, renderFortsettKnapp, intl } = this.props;

        const formProps = {
            className: 'steg',
            summaryTitle: getMessage(intl, 'validering.oppsummeringstittel'),
            onSubmit: this.handleOnSubmit
        };

        return (
            <ValidForm {...formProps}>
                <div className="blokk-m">
                    <StegHeader id={id} />
                </div>

                {this.props.children}
                {renderFortsettKnapp === true && (
                    <FortsettKnapp>
                        {stegConfig[id].fortsettKnappLabel}
                    </FortsettKnapp>
                )}
            </ValidForm>
        );
    }
}
export default injectIntl(Steg);
