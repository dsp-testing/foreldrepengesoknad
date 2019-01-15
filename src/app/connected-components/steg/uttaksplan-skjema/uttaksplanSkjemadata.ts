export enum ValgalternativerAdopsjonStartdato {
    'ankomst' = 'ankomst',
    'omsorgsovertakelse' = 'omsorgsovertakelse',
    'annen' = 'annen'
}

export enum ValgalternativerAleneomsorgFarMedmor {
    'datoForAleneomsorg' = 'datoForAleneomsorg',
    'annen' = 'annen'
}

export interface UttaksplanSkjemadata {
    startdatoPermisjon?: Date;
    morSinSisteUttaksdag?: Date;
    skalStarteRettEtterMor?: boolean;
    skalIkkeHaUttakFørTermin?: boolean;
    harPlanlagtOppholdIUttak?: boolean;
    fellesperiodeukerMor?: number;
    forslagLaget?: boolean;
    harAnnenForelderSøktFP?: boolean;
    skalHaDelAvFellesperiode?: boolean;
    utsettelseEtterMorSkjemaValid?: boolean;
    planlagtOppholdSkjemaValid?: boolean;
    valgtAdopsjonStartdato?: ValgalternativerAdopsjonStartdato;
    valgtStartdatoAleneomsorgFarMedmor?: ValgalternativerAleneomsorgFarMedmor;
    farSinFørsteUttaksdagSpørsmål?: Date;
    antallUkerFellesperiodeFarMedmor?: number;
    antallDagerFellesperiodeFarMedmor?: number;
}
