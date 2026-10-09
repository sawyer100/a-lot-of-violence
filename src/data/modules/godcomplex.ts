
import raw from '../../../godcomplex.js?raw'
import { createScriptSource } from '../../utils/scriptSource'
import { buildInstallSteps } from '../installFlow'
import type { ModuleDefinition } from '../types'

const name = 'Godcomplex'
const script = createScriptSource('godcomplex.js', raw)

export const godcomplex: ModuleDefinition = {
  slug: 'godcomplex',
  name,
  theme: 'blood',
  tagline:
    'Reinforces powerful characters’ convictions, authority and personal worldview.',
  blurb: 'The most frightening person in the room may be the one who never doubts.',
  script,
  settings: [],
  steps: buildInstallSteps({
    scriptName: name,
    marker: '[GODCOMPLEX]',
    testMessage:
      'A powerful character is told that their beliefs are wrong and that they must surrender their authority.',
  }),
  completeNote:
    'Reinforces established characterization without inventing powers, motives or actions.',
}
