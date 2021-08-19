import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from 'stories/steps/uttaksplan-info/far-medmor-fødsel-mor-har-ikke-rett/FarMedmorFødselOgMorHarIkkeRett.stories';

const { UttaksplanDerMorIkkeHarRettPåForeldrepenger } = composeStories(stories);

const GÅ_VIDERE_KNAPP = 'Gå videre';

describe('<UttaksplanInfo_MorFarAdopsjon>', () => {
    it('skal fylle ut dekningsgrad med 80 prosent', async () => {
        render(<UttaksplanDerMorIkkeHarRettPåForeldrepenger />);

        expect(await screen.findByText('Hvor lang periode med foreldrepenger har dere valgt?')).toBeInTheDocument();
        expect(screen.queryByText(GÅ_VIDERE_KNAPP)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('50 uker med 80 prosent foreldrepenger'));

        expect(await screen.findByText('Periode med foreldrepenger')).toBeInTheDocument();
        expect(screen.getByText('50 uker')).toBeInTheDocument();

        expect(await screen.findByText(GÅ_VIDERE_KNAPP)).toBeInTheDocument();
    });

    it('skal fylle ut dekningsgrad med 100 prosent', async () => {
        render(<UttaksplanDerMorIkkeHarRettPåForeldrepenger />);

        expect(await screen.findByText('Hvor lang periode med foreldrepenger har dere valgt?')).toBeInTheDocument();
        expect(screen.queryByText(GÅ_VIDERE_KNAPP)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('40 uker med 100 prosent foreldrepenger'));

        expect(await screen.findByText('Periode med foreldrepenger')).toBeInTheDocument();
        expect(screen.getByText('40 uker')).toBeInTheDocument();

        expect(await screen.findByText(GÅ_VIDERE_KNAPP)).toBeInTheDocument();
    });
});
