import type { ModuleDefinition } from '../types'
import { actionVariety } from './actionVariety'
import { bloodloss } from './bloodloss'
import { extremeViolence } from './extremeViolence'
import { historicalEquipment } from './historicalEquipment'
import { noCleanFights } from './noCleanFights'
import { maliceAforethought } from './maliceAforethought'
import { sceneAftermath } from './sceneAftermath'
import { saySomethingHorrible } from './saySomethingHorrible'
import { theQuietPart } from './theQuietPart'
import { stopSmirking } from './stopSmirking'
import { youreCooked } from './youreCooked'
import { physicalMomentum } from './physicalMomentum'
import { godcomplex } from './godcomplex'

/*
 * The module registry. The home page, navigation, routes and documentation
 * are all generated from this list.
 *
 * To add a module:
 *   1. Put the script file in the repository root.
 *   2. Copy one of the files in this folder and edit the text.
 *   3. Add it to the array below.
 *   4. Optional: give it its own accent in src/themes/themes.css and themes.ts.
 */
export const modules: ModuleDefinition[] = [
  historicalEquipment,
  actionVariety,
  youreCooked,
  stopSmirking,
  noCleanFights,
  bloodloss,
  sceneAftermath,
  saySomethingHorrible,
  maliceAforethought,
  theQuietPart,
  extremeViolence,
  physicalMomentum,
  godcomplex,
]

export function findModule(slug: string): ModuleDefinition | undefined {
  return modules.find((module) => module.slug === slug)
}
