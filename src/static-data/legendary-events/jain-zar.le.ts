﻿import { LegendaryEvent, LegendaryEventTrack, UnitData } from '../interfaces';
import { Alliance, DamageTypes, Faction, Traits } from '../enums';
import { sortBy, uniqBy } from 'lodash';
import { PersonalCharacterData } from '../../personal-data/personal-data.interfaces';

export class JainZarLegendaryEvent implements LegendaryEvent {
    alphaTrack: LegendaryEventTrack;
    betaTrack: LegendaryEventTrack;
    gammaTrack: LegendaryEventTrack;

    constructor(unitsData: Array<UnitData & Partial<PersonalCharacterData>>) {
        this.alphaTrack = this.getAlphaTrack(unitsData);
        this.betaTrack = this.getBetaTrack(unitsData);
        this.gammaTrack = this.getGammaTrack(unitsData);
    }

    getAllowedUnits(): Array<UnitData & Partial<PersonalCharacterData>> {
        const alpha = this.alphaTrack.getAllowedUnits();
        const beta = this.betaTrack.getAllowedUnits();
        const gamma = this.gammaTrack.getAllowedUnits();
        return sortBy(uniqBy([...alpha, ...beta, ...gamma], 'name'), 'name');
    }

    private getAlphaTrack(unitsData: Array<UnitData & Partial<PersonalCharacterData>>): LegendaryEventTrack {
        const xenosOnly = unitsData.filter( (unit) => unit.alliance === Alliance.Xenos);
        return {
            unitsRestrictions: [
                {
                    name: 'Physical',
                    points: 100,
                    units: xenosOnly.filter((unit) => (unit.damageTypes & DamageTypes.Physical) === DamageTypes.Physical),
                },
                {
                    name: 'Ranged',
                    points: 60,
                    units: xenosOnly.filter((unit) => !!unit.rangeHits),
                },
                {
                    name: 'Max 3 hits',
                    points: 45,
                    units: xenosOnly.filter( (unit) => (!unit.rangeHits && unit.meleeHits <= 3) || (!!unit.rangeHits && unit.rangeHits <= 3)),
                },
                {
                    name: 'Necrons only',
                    points: 110,
                    units: xenosOnly.filter((unit) => unit.faction === Faction.Necrons),
                },
                {
                    name: 'No Summons',
                    points: 60,
                    units: xenosOnly.filter(unit => !unit.forcedSummons),
                },
            ],
            getAllowedUnits: function (): Array<UnitData & Partial<PersonalCharacterData>> {
                return sortBy(uniqBy(this.unitsRestrictions.flatMap(r => r.units), 'name'), 'name');
            }
        };
    }

    private getBetaTrack(unitsData: Array<UnitData & Partial<PersonalCharacterData>>): LegendaryEventTrack {
        const imperialOnly = unitsData.filter( (unit) => unit.alliance === Alliance.Imperial);
        return {
            unitsRestrictions: [
                {
                    name: 'Power',
                    points: 95,
                    units: imperialOnly.filter((unit) => (unit.damageTypes & DamageTypes.Power) === DamageTypes.Power),
                },
                {
                    name: 'Bolter',
                    points: 95,
                    units: imperialOnly.filter((unit) => (unit.damageTypes & DamageTypes.Bolter) === DamageTypes.Bolter),
                },
                {
                    name: 'No Blast',
                    points: 50,
                    units:  imperialOnly.filter((unit) => (unit.damageTypes & DamageTypes.Blast) !== DamageTypes.Blast),
                },
                {
                    name: 'Max 2 hits',
                    points: 70,
                    units: imperialOnly.filter( (unit) => (!unit.rangeHits && unit.meleeHits <= 2) || (!!unit.rangeHits && unit.rangeHits <= 2)),
                },
                {
                    name: 'No Summons',
                    points: 60,
                    units: imperialOnly.filter(unit => !unit.forcedSummons),
                },
            ],
            getAllowedUnits: function (): Array<UnitData & Partial<PersonalCharacterData>> {
                return sortBy(uniqBy(this.unitsRestrictions.flatMap(r => r.units), 'name'), 'name');
            }
        };
    }

    private getGammaTrack(unitsData: Array<UnitData & Partial<PersonalCharacterData>>): LegendaryEventTrack {
        const noOrks = unitsData.filter( (unit) => unit.faction !== Faction.Orks);
        return {
            unitsRestrictions: [
                {
                    name: 'No Mech',
                    points: 45,
                    units: noOrks.filter((unit) => (unit.traits & Traits.Mechanical) !==  Traits.Mechanical &&  (unit.traits & Traits.LivingMetal) !==  Traits.LivingMetal),
                },
                {
                    name: 'Piercing',
                    points: 100,
                    units: noOrks.filter((unit) => (unit.damageTypes & DamageTypes.Piercing) === DamageTypes.Piercing),
                },
                {
                    name: 'Bolter',
                    points: 95,
                    units:  noOrks.filter((unit) => (unit.damageTypes & DamageTypes.Bolter) === DamageTypes.Bolter),
                },
                {
                    name: 'No Flying',
                    points: 45,
                    units: noOrks.filter((unit) => (unit.traits & Traits.Flying) !==  Traits.Flying),
                },
                {
                    name: 'Min 4 hits',
                    points: 90,
                    units: noOrks.filter( (unit) => (!unit.rangeHits && unit.meleeHits >= 4) || (!!unit.rangeHits && unit.rangeHits >= 4)),
                },
            ],
            getAllowedUnits: function (): Array<UnitData & Partial<PersonalCharacterData>> {
                return sortBy(uniqBy(this.unitsRestrictions.flatMap(r => r.units), 'name'), 'name');
            }
        };
    }

}