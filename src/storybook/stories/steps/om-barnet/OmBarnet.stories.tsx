import React from 'react';
import { Story } from '@storybook/react';

import søkerinfo from './testdata/søkerinfo.json';
import context from './testdata/context.json';
import { SøkerinfoDTO } from 'app/types/SøkerinfoDTO';
import { ForeldrepengesøknadContextState } from 'app/context/ForeldrepengesøknadContextConfig';
import OmBarnet from 'app/steps/om-barnet/OmBarnet';
import withIntlProvider from '../../../decorators/withIntl';
import withRouter from '../../../decorators/withRouter';
import withForeldrepengersøknadContext from '../../../decorators/withForeldrepengersøknadContext';
import ForeldrepengerStateMock from '../../../utils/ForeldrepengerStateMock';

export default {
    title: 'steps/OmBarnet',
    component: OmBarnet,
    decorators: [withRouter, withIntlProvider, withForeldrepengersøknadContext],
};

interface Props {
    context: ForeldrepengesøknadContextState;
    søkerinfo: SøkerinfoDTO;
}

const Template: Story<Props> = ({ context, søkerinfo }) => {
    return (
        <ForeldrepengerStateMock søknad={context} søkerinfo={søkerinfo}>
            <OmBarnet />
        </ForeldrepengerStateMock>
    );
};

export const Default = Template.bind({});
Default.args = {
    context,
    søkerinfo,
};

export const ForAdopsjon = Template.bind({});
ForAdopsjon.args = {
    context: {
        ...context,
        søknad: {
            ...context.søknad,
            søkersituasjon: {
                situasjon: 'adopsjon',
                rolle: 'mor',
            },
        },
    } as ForeldrepengesøknadContextState,
    søkerinfo,
};
