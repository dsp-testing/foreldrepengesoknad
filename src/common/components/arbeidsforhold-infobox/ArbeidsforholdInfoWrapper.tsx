import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';

import Arbeidsforhold from '../../../app/types/Arbeidsforhold';

import ArbeidsforholdInfoBox from 'common/components/arbeidsforhold-infobox/ArbeidsforholdInfoBox';
import getMessage from 'common/util/i18nUtils';

import './arbeidsforhold.less';

interface ArbeidsforholdInfoWrapperProps {
    arbeidsforhold: Arbeidsforhold[];
}
const ArbeidsforholdInfoWrapper: React.StatelessComponent<
    ArbeidsforholdInfoWrapperProps & InjectedIntlProps
> = ({ arbeidsforhold, intl }) => {
    return (
        <React.Fragment>
            {(arbeidsforhold === undefined ||
                (arbeidsforhold && arbeidsforhold.length === 0)) && (
                <div className="arbeidsforholdInfoBox">
                    <Normaltekst>
                        {getMessage(
                            intl,
                            'annenInntekt.arbeidsforhold.ingenRegistrerteArbeidsforhold'
                        )}
                    </Normaltekst>
                </div>
            )}
            {arbeidsforhold &&
                arbeidsforhold.length > 0 && (
                    <ul className="arbeidsforholdList">
                        {arbeidsforhold.map(
                            (arbeidsforholdElement: Arbeidsforhold) => (
                                <li key={arbeidsforholdElement.arbeidsgiverId}>
                                    <ArbeidsforholdInfoBox
                                        key={
                                            arbeidsforholdElement.arbeidsgiverId
                                        }
                                        arbeidsforhold={arbeidsforholdElement}
                                    />
                                </li>
                            )
                        )}
                    </ul>
                )}
        </React.Fragment>
    );
};

export default injectIntl(ArbeidsforholdInfoWrapper);
