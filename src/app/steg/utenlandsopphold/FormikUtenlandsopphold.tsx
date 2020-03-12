import React from 'react';
import Block from 'common/components/block/Block';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { BostedUtland } from '@navikt/sif-common-forms/lib/bosted-utland/types';
import moment from 'moment';
import getMessage from 'common/util/i18nUtils';
import { injectIntl, InjectedIntl } from 'react-intl';

const enum UtenlandsoppholdFieldNames {
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd'
}

export interface UtenlandsoppholdFormValues {
    [UtenlandsoppholdFieldNames.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [UtenlandsoppholdFieldNames.utenlandsoppholdSiste12Mnd]: BostedUtland[];
    [UtenlandsoppholdFieldNames.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [UtenlandsoppholdFieldNames.utenlandsoppholdNeste12Mnd]: BostedUtland[];
}

const FormComponents = getTypedFormComponents<UtenlandsoppholdFieldNames, UtenlandsoppholdFormValues>();

const initialValues: UtenlandsoppholdFormValues = {
    harBoddUtenforNorgeSiste12Mnd: YesOrNo.UNANSWERED,
    skalBoUtenforNorgeNeste12Mnd: YesOrNo.UNANSWERED,
    utenlandsoppholdNeste12Mnd: [],
    utenlandsoppholdSiste12Mnd: []
};

const dateToday = new Date();
const date1YearFromNow = moment()
    .add(1, 'year')
    .toDate();
const date1YearAgo = moment()
    .subtract(1, 'year')
    .toDate();

interface Props {
    intl: InjectedIntl;
    onValidSubmit: (values: UtenlandsoppholdFormValues) => void;
}

const MedlemsskapStep: React.FunctionComponent<Props> = ({ intl, onValidSubmit }) => {
    return (
        <FormComponents.FormikWrapper
            initialValues={initialValues}
            onSubmit={(values: UtenlandsoppholdFormValues) => onValidSubmit(values)}
            renderForm={({ values: formValues }) => {
                return (
                    <div>
                        <FormComponents.Form
                            includeButtons={true}
                            submitButtonLabel="Gå videre"
                            fieldErrorRenderer={() => true}
                            includeValidationSummary={true}
                        >
                            <div>
                                <Block margin="xl">
                                    <FormComponents.YesOrNoQuestion
                                        legend={'test'}
                                        name={UtenlandsoppholdFieldNames.harBoddUtenforNorgeSiste12Mnd}
                                        info={'test'}
                                    />
                                </Block>
                                {formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                                    <Block margin="m">
                                        <BostedUtlandListAndDialog<UtenlandsoppholdFieldNames>
                                            name={UtenlandsoppholdFieldNames.utenlandsoppholdSiste12Mnd}
                                            minDate={date1YearAgo}
                                            maxDate={dateToday}
                                            labels={{
                                                addLabel: 'Legg til nytt utenlandsopphold',
                                                modalTitle: 'Utenlandsopphold siste 12 måneder'
                                            }}
                                        />
                                    </Block>
                                )}
                                <Block>
                                    <FormComponents.YesOrNoQuestion
                                        legend={getMessage(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                                        name={UtenlandsoppholdFieldNames.skalBoUtenforNorgeNeste12Mnd}
                                        info={getMessage(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                                    />
                                </Block>
                                {formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                                    <Block margin="m">
                                        <BostedUtlandListAndDialog<UtenlandsoppholdFieldNames>
                                            minDate={dateToday}
                                            maxDate={date1YearFromNow}
                                            name={UtenlandsoppholdFieldNames.utenlandsoppholdNeste12Mnd}
                                            labels={{
                                                addLabel: 'Legg til nytt utenlandsopphold',
                                                modalTitle: 'Utenlandsopphold neste 12 måneder'
                                            }}
                                        />
                                    </Block>
                                )}
                            </div>
                        </FormComponents.Form>
                    </div>
                );
            }}
        />
    );
};

export default injectIntl(MedlemsskapStep);
