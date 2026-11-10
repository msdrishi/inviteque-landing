import React from 'react';
import TemplatePinkBlossom from '../../../../templates/pink-blossom/index.jsx';
import { alinaTanmayData } from './data.js';
import AlinaAndTanmayHero from './AlinaAndTanmayHero.jsx';

export default function CustomAlinaAndTanmay() {
  return (
    <TemplatePinkBlossom
      savedData={alinaTanmayData}
      customHeroComponent={AlinaAndTanmayHero}
    />
  );
}
