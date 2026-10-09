
import raw from '../../../physical_momentum_engine.js?raw'
import { createScriptSource } from '../../utils/scriptSource'
import { buildInstallSteps } from '../installFlow'
import type { ModuleDefinition } from '../types'

const name = 'Physical Momentum Engine'
const script = createScriptSource('physical_momentum_engine.js', raw)

export const physicalMomentum: ModuleDefinition = {
  slug: 'physical-momentum-engine',
  name,
  theme: 'blood',
  tagline:
    'Preserves established positions, movement, held objects and environmental changes.',
  blurb: 'Actions have consequences. Positions do not reset.',
  script,
  settings: [],
  steps: buildInstallSteps({
    scriptName: name,
    marker: '[PHYSICAL MOMENTUM]',
    testMessage:
      'The character drops the key, falls to the floor, and leaves the door open.',
  }),
  completeNote:
    'Preserves recent physical continuity without inventing new events.',
}
