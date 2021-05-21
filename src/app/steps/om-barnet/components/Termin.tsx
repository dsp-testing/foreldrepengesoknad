import { Block, intlUtils, UtvidetInformasjon } from '@navikt/fp-common';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionVisibility } from '@navikt/sif-common-question-config/lib';
import FormikFileUploader from 'app/components/formik-file-uploader/FormikFileUploader';
import Søkersituasjon from 'app/context/types/Søkersituasjon';
import { AttachmentType } from 'app/types/AttachmentType';
import { Skjemanummer } from 'app/types/Skjemanummer';
import VeilederNormal from 'common/components/veileder/VeilederNormalSvg';
import Veilederpanel from 'nav-frontend-veilederpanel';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { OmBarnetFormComponents, OmBarnetFormData, OmBarnetFormField } from '../omBarnetFormConfig';

interface Props {
    søkersituasjon: Søkersituasjon;
    formValues: OmBarnetFormData;
    visibility: QuestionVisibility<OmBarnetFormField, undefined>;
}

const Termin: FunctionComponent<Props> = ({ søkersituasjon, visibility, formValues }) => {
    if (søkersituasjon.situasjon === 'adopsjon' || formValues.erBarnetFødt !== YesOrNo.NO) {
        return null;
    }

    const intl = useIntl();

    return (
        <>
            <Block padBottom="l" visible={visibility.isVisible(OmBarnetFormField.antallBarn)}>
                <OmBarnetFormComponents.RadioPanelGroup
                    name={OmBarnetFormField.antallBarn}
                    radios={[
                        {
                            label: intlUtils(intl, 'omBarnet.radiobutton.ettBarn'),
                            value: '1',
                        },
                        {
                            label: intlUtils(intl, 'omBarnet.radiobutton.tvillinger'),
                            value: '2',
                        },
                        {
                            label: intlUtils(intl, 'omBarnet.radiobutton.flere'),
                            value: '3',
                        },
                    ]}
                    useTwoColumns={true}
                    legend={intlUtils(intl, 'omBarnet.antallBarn.termin')}
                />
            </Block>
            <Block
                padBottom="l"
                visible={formValues.antallBarn !== undefined && parseInt(formValues.antallBarn, 10) >= 3}
            >
                <OmBarnetFormComponents.Select name={OmBarnetFormField.antallBarn}>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                </OmBarnetFormComponents.Select>
            </Block>
            <Block padBottom="l" visible={visibility.isVisible(OmBarnetFormField.termindato)}>
                <OmBarnetFormComponents.DatePicker
                    name={OmBarnetFormField.termindato}
                    label={intlUtils(intl, 'omBarnet.termindato.termin')}
                    placeholder={'dd.mm.åååå'}
                    description={
                        <UtvidetInformasjon apneLabel={intlUtils(intl, 'omBarnet.termindato.åpneLabel')}>
                            {intlUtils(intl, 'omBarnet.termindato.infotekst')}
                        </UtvidetInformasjon>
                    }
                />
            </Block>
            <Block padBottom="l" visible={visibility.isVisible(OmBarnetFormField.terminbekreftelse)}>
                <Veilederpanel fargetema="normal" svg={<VeilederNormal />}>
                    <FormattedMessage id="omBarnet.veileder.terminbekreftelse" />
                </Veilederpanel>
            </Block>
            <Block padBottom="l" visible={visibility.isVisible(OmBarnetFormField.terminbekreftelse)}>
                <FormikFileUploader
                    label={intlUtils(intl, 'annenForelder.farMedmor.dokumentasjonAvAleneomsorg.lastOpp')}
                    name={OmBarnetFormField.terminbekreftelse}
                    attachments={formValues.terminbekreftelse || []}
                    attachmentType={AttachmentType.TERMINBEKREFTELSE}
                    skjemanummer={Skjemanummer.TERMINBEKREFTELSE}
                />
            </Block>
            <Block padBottom="l" visible={visibility.isVisible(OmBarnetFormField.terminbekreftelsedato)}>
                <OmBarnetFormComponents.DatePicker
                    name={OmBarnetFormField.terminbekreftelsedato}
                    label={intlUtils(intl, 'omBarnet.terminbekreftelseDato')}
                    placeholder={'dd.mm.åååå'}
                />
            </Block>
        </>
    );
};

export default Termin;
