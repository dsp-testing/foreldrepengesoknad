import { Block, intlUtils } from '@navikt/fp-common';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionVisibility } from '@navikt/sif-common-question-config/lib';
import { FrilansOppdrag } from 'app/context/types/Frilans';
import { Knapp } from 'nav-frontend-knapper';
import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    InntektsinformasjonFormComponents,
    InntektsinformasjonFormData,
    InntektsinformasjonFormField,
} from '../../inntektsinformasjonFormConfig';
import FrilansoppdragListe from './FrilansoppdragListe';
import HvemKanVæreFrilanser from './HvemKanVæreFrilanser';
import FrilansoppdragModal from './modal/FrilansoppdragModal';

interface Props {
    frilansoppdrag: FrilansOppdrag[];
    setFrilansoppdrag: (oppdrag: FrilansOppdrag[]) => void;
    visibility: QuestionVisibility<InntektsinformasjonFormField, undefined>;
    formValues: InntektsinformasjonFormData;
}

const Frilans: FunctionComponent<Props> = ({ frilansoppdrag, setFrilansoppdrag, visibility, formValues }) => {
    const intl = useIntl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOppdrag, setSelectedOppdrag] = useState<FrilansOppdrag>();

    const addFrilansoppdrag = (oppdrag: FrilansOppdrag) => {
        const updatedFrilansoppdrag = frilansoppdrag.concat(oppdrag);

        setFrilansoppdrag(updatedFrilansoppdrag);
    };

    const deleteFrilansoppdrag = (oppdrag: FrilansOppdrag) => {
        const updatedFrilansoppdrag = frilansoppdrag.filter((opp) => opp !== oppdrag);

        setFrilansoppdrag(updatedFrilansoppdrag);
    };

    const editFrilansoppdrag = (oppdrag: FrilansOppdrag) => {
        const updatedFrilansoppdrag = frilansoppdrag.filter((opp) => opp !== selectedOppdrag).concat(oppdrag);

        setFrilansoppdrag(updatedFrilansoppdrag);
    };

    const selectOppdrag = (frilansoppdrag: FrilansOppdrag) => {
        setSelectedOppdrag(frilansoppdrag);
        setIsModalOpen(true);
    };

    const handleOnLeggTil = () => {
        setIsModalOpen(true);
        setSelectedOppdrag(undefined);
    };

    return (
        <>
            <Block padBottom="l" visible={visibility.isVisible(InntektsinformasjonFormField.hattInntektSomFrilans)}>
                <InntektsinformasjonFormComponents.YesOrNoQuestion
                    name={InntektsinformasjonFormField.hattInntektSomFrilans}
                    legend={intlUtils(intl, 'inntektsinformasjon.harDuJobbetSomFrilansSiste10Mnd')}
                    description={<HvemKanVæreFrilanser />}
                />
            </Block>
            {formValues.hattInntektSomFrilans === YesOrNo.YES && (
                <div style={{ backgroundColor: '#e9e7e7', marginBottom: '1rem', padding: '1rem' }}>
                    <Block
                        padBottom="l"
                        visible={visibility.isVisible(InntektsinformasjonFormField.frilansOppstartsDato)}
                    >
                        <InntektsinformasjonFormComponents.DatePicker
                            name={InntektsinformasjonFormField.frilansOppstartsDato}
                            label={intlUtils(intl, 'inntektsinformasjon.frilans.oppstart')}
                        />
                    </Block>
                    <Block
                        padBottom="l"
                        visible={visibility.isVisible(InntektsinformasjonFormField.jobberFremdelesSomFrilanser)}
                    >
                        <InntektsinformasjonFormComponents.YesOrNoQuestion
                            name={InntektsinformasjonFormField.jobberFremdelesSomFrilanser}
                            legend={intlUtils(intl, 'inntektsinformasjon.frilans.jobberFremdelesSomFrilans')}
                        />
                    </Block>
                    <Block
                        padBottom="l"
                        visible={visibility.isVisible(InntektsinformasjonFormField.oppdragForNæreVennerEllerFamilie)}
                    >
                        <InntektsinformasjonFormComponents.YesOrNoQuestion
                            name={InntektsinformasjonFormField.oppdragForNæreVennerEllerFamilie}
                            legend={intlUtils(intl, 'inntektsinformasjon.harJobbetForNærVennEllerFamilieSiste10Mnd')}
                        />
                    </Block>
                    <Block padBottom="l" visible={formValues.oppdragForNæreVennerEllerFamilie === YesOrNo.YES}>
                        <Block padBottom="l">
                            <Knapp onClick={handleOnLeggTil}>
                                <FormattedMessage id="inntektsinformasjon.leggTilOppdrag" />
                            </Knapp>
                        </Block>
                        <FrilansoppdragModal
                            isOpen={isModalOpen}
                            title="Test"
                            onRequestClose={() => setIsModalOpen(false)}
                            selectedFrilansoppdrag={selectedOppdrag}
                            addFrilansoppdrag={addFrilansoppdrag}
                            editFrilansoppdrag={editFrilansoppdrag}
                        />
                        <FrilansoppdragListe
                            frilansoppdrag={frilansoppdrag}
                            deleteFrilansoppdrag={deleteFrilansoppdrag}
                            selectOppdrag={selectOppdrag}
                        />
                    </Block>
                    <Block
                        padBottom="l"
                        visible={visibility.isVisible(InntektsinformasjonFormField.inntektSomFosterforelder)}
                    >
                        <InntektsinformasjonFormComponents.YesOrNoQuestion
                            name={InntektsinformasjonFormField.inntektSomFosterforelder}
                            legend={intlUtils(intl, 'inntektsinformasjon.driverFosterhjem')}
                        />
                    </Block>
                </div>
            )}
        </>
    );
};

export default Frilans;
