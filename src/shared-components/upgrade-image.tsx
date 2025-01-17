﻿import { Tooltip } from '@mui/material';
import React from 'react';
import { Rarity } from '../models/enums';

export const UpgradeImage = ({
    material,
    iconPath,
    rarity,
    size,
}: {
    material: string;
    iconPath: string;
    rarity: Rarity;
    size?: number;
}) => {
    try {
        // const
        const imagePath = iconPath || material.toLowerCase() + '.png';
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = require(`../assets/images/upgrades/${imagePath}`);

        return (
            <Tooltip title={material} enterTouchDelay={0} placement={'right'}>
                <div style={{ width: size ?? 50, height: size ?? 50 }} className={Rarity[rarity]?.toLowerCase()}>
                    <img loading={'lazy'} style={{}} src={image} height={size ?? 50} alt={material} />
                </div>
            </Tooltip>
        );
    } catch (error) {
        // console.log(`Image for "${material}" with path "${iconPath}" does not exist`);
        return (
            <Tooltip title={material} enterTouchDelay={0} placement={'right'}>
                <div>{material}</div>
            </Tooltip>
        );
    }
};
