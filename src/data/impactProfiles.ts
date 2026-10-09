export type ImpactDomain = 'violence' | 'continuity' | 'style' | 'dialogue' | 'intent' | 'equipment'

export interface ImpactProfile {
  slug: string
  maxTokens: number
  typicalTokens: number
  activation: 'rare' | 'situational' | 'frequent'
  strength: 1 | 2 | 3 | 4 | 5
  domains: ImpactDomain[]
  sharedBudget?: 'dialogue'
  note: string
}

/*
 * Calculator metadata. Token figures are deliberately conservative estimates:
 * maxTokens follows each script's own budget; typicalTokens estimates an active
 * injection, not an every-turn charge. Inactive conditional scripts inject 0.
 */
export const impactProfiles: ImpactProfile[] = [
  { slug: 'medieval-torture-devices', maxTokens: 220, typicalTokens: 145, activation: 'situational', strength: 3, domains: ['equipment'], note: 'Large catalogue, but only a ranked shortlist is injected when relevant.' },
  { slug: 'violence-and-shit', maxTokens: 150, typicalTokens: 105, activation: 'situational', strength: 3, domains: ['violence', 'style'], note: 'Adds varied action guidance only around an already-relevant confrontation.' },
  { slug: 'very-very-hostile-brutality', maxTokens: 150, typicalTokens: 110, activation: 'situational', strength: 4, domains: ['violence', 'style'], note: 'Stronger behavioral guidance when an already-hostile scene qualifies.' },
  { slug: 'stop-fucking-smirking', maxTokens: 150, typicalTokens: 85, activation: 'frequent', strength: 2, domains: ['style'], note: 'Only injects after repeated prose habits are detected.' },
  { slug: 'no-clean-fights', maxTokens: 180, typicalTokens: 145, activation: 'situational', strength: 3, domains: ['violence', 'continuity'], note: 'Carries mess, fatigue and environmental consequences through active conflict.' },
  { slug: 'bloodloss', maxTokens: 180, typicalTokens: 145, activation: 'situational', strength: 3, domains: ['continuity'], note: 'Carries established fictional injury state without forcing escalation.' },
  { slug: 'scene-aftermath', maxTokens: 160, typicalTokens: 120, activation: 'situational', strength: 2, domains: ['continuity'], note: 'Carries consequences the story already established; shrinks to 100 tokens beside Bloodloss or No Clean Fights.' },
  { slug: 'say-something-horrible', maxTokens: 125, typicalTokens: 115, activation: 'situational', strength: 4, domains: ['dialogue', 'style'], sharedBudget: 'dialogue', note: 'Shares a 360-token ceiling with the other dialogue/intent modules.' },
  { slug: 'malice-aforethought', maxTokens: 130, typicalTokens: 120, activation: 'situational', strength: 4, domains: ['intent'], sharedBudget: 'dialogue', note: 'Reinforces motive and intention continuity when the scene supports it.' },
  { slug: 'the-quiet-part', maxTokens: 125, typicalTokens: 110, activation: 'rare', strength: 3, domains: ['dialogue', 'intent'], sharedBudget: 'dialogue', note: 'Requires both a guarded character and meaningful conversational pressure.' },
  { slug: 'physical-momentum-engine', maxTokens: 170, typicalTokens: 125, activation: 'frequent', strength: 3, domains: ['continuity'], note: 'Tracks established positions, held objects, movement, and environmental changes when recent messages provide enough evidence.' },
  { slug: 'godcomplex', maxTokens: 170, typicalTokens: 145, activation: 'situational', strength: 3, domains: ['intent', 'dialogue'], note: 'Reinforces an established character worldview or authority when a relevant challenge or conviction is present.' },
  { slug: 'youre-cooked', maxTokens: 210, typicalTokens: 170, activation: 'rare', strength: 4, domains: ['style', 'continuity'], note: 'Activates only when recent context establishes both credible danger and helplessness.' },
]

export const impactProfileBySlug = new Map(impactProfiles.map((profile) => [profile.slug, profile]))
