export interface TreeSpecies {
  id: string;
  name: string;
  icon: string;
  maxStages: number;
  description: string;
}

export const TREE_SPECIES_LIST: TreeSpecies[] = [
  { id: 'oak', name: 'Дуб стійкості', icon: '🌳', maxStages: 5, description: 'Символ незламності та довголіття' },
  { id: 'pine', name: 'Гірська сосна', icon: '🌲', maxStages: 5, description: 'Очищує легені свіжим ароматом' },
  { id: 'sakura', name: 'Квітуча сакура', icon: '🌸', maxStages: 5, description: 'Символ нового початку та відродження' },
  { id: 'bonsai', name: 'Дзен бонсай', icon: '🪴', maxStages: 5, description: 'Терпіння, медитація та контроль над думками' },
];

export const TREE_SPECIES: any = Object.assign([...TREE_SPECIES_LIST], {
  oak: TREE_SPECIES_LIST[0],
  pine: TREE_SPECIES_LIST[1],
  sakura: TREE_SPECIES_LIST[2],
  bonsai: TREE_SPECIES_LIST[3],
});

export function getTreeStageInfo(growthOrSpeciesIndex: any, stageNum?: number) {
  let stage = 0;
  let species = TREE_SPECIES.pine;

  if (typeof growthOrSpeciesIndex === 'number' && stageNum !== undefined) {
    species = TREE_SPECIES_LIST[growthOrSpeciesIndex % TREE_SPECIES_LIST.length] || TREE_SPECIES.pine;
    stage = stageNum;
  } else if (typeof growthOrSpeciesIndex === 'number') {
    stage = Math.min(4, Math.floor(growthOrSpeciesIndex / 25));
  } else if (growthOrSpeciesIndex && typeof growthOrSpeciesIndex === 'object') {
    stage = growthOrSpeciesIndex.stage || 0;
    if (growthOrSpeciesIndex.speciesId && TREE_SPECIES[growthOrSpeciesIndex.speciesId]) {
      species = TREE_SPECIES[growthOrSpeciesIndex.speciesId];
    }
  }

  const stageNames = ['Пагінець', 'Молоде деревце', 'Зміцніле дерево', 'Квітуче дерево', 'Віковий лісовий велет'];
  return {
    species,
    stageName: stageNames[Math.min(stage, stageNames.length - 1)],
    stageNumber: stage,
    isFullyGrown: stage >= 4,
  };
}
