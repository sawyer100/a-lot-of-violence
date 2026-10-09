
"use worker";

/*
 * Godcomplex — JanitorAI
 * Reinforces established convictions, authority, and worldview.
 * Does not invent beliefs, powers, motives, or actions.
 */

context.character = context.character || {};
context.chat = context.chat || {};
context.character.scenario = context.character.scenario || "";

const CONFIG = {
    DEBUG: false,
    HISTORY_DEPTH: 6,
    MAX_TOKENS: 170,
    MIN_SCORE: 3
};

const MARKER = "[GODCOMPLEX]";

const lastMessage =
    typeof context.chat.last_message === "string"
        ? context.chat.last_message
        : "";

const history = Array.isArray(context.chat.last_messages)
    ? context.chat.last_messages
    : [];

const messages = history
    .map(function (item) {
        if (typeof item === "string") return item;
        if (item && typeof item.message === "string") {
            return item.message;
        }
        if (item && typeof item.content === "string") {
            return item.content;
        }
        return "";
    })
    .filter(Boolean);

if (lastMessage && messages[messages.length - 1] !== lastMessage) {
    messages.push(lastMessage);
}

const recent = messages.slice(-CONFIG.HISTORY_DEPTH);
if (recent.length === 0) return;

const signals = [
    {
        id: "challenged",
        weight: 2,
        pattern: /\b(challeng(?:e|es|ed|ing)|defy|defies|defied|question(?:s|ed|ing)?|doubt(?:s|ed|ing)?)\b/i
    },
    {
        id: "authority",
        weight: 2,
        pattern: /\b(obey|obedience|kneel|kneels|command|commands|rule|ruler|submit|submission)\b/i
    },
    {
        id: "identity",
        weight: 2,
        pattern: /\b(god|goddess|immortal|eternal|invincible|supreme|destiny|divine|inevitable)\b/i
    },
    {
        id: "ideology",
        weight: 2,
        pattern: /\b(believe|belief|justice|order|weakness|strength|necessary|deserve|deserves|deserved)\b/i
    },
    {
        id: "threat",
        weight: 2,
        pattern: /\b(threaten|threatens|threatened|defeat|defeated|humiliate|humiliated|confront|confronted)\b/i
    }
];

let score = 0;

recent.forEach(function (message, index) {
    const recency = index === recent.length - 1 ? 2 : 1;
    signals.forEach(function (signal) {
        if (signal.pattern.test(message)) {
            score += signal.weight * recency;
        }
    });
});

if (score < CONFIG.MIN_SCORE) return;
if (context.character.scenario.includes(MARKER)) return;

let note =
    "\n\n" + MARKER + "\n" +
    "CHARACTER CONVICTION: Preserve the character's established " +
    "worldview, identity, motives, values, and limits. When challenged, " +
    "let the character respond from their own genuine logic rather than " +
    "automatically conceding or becoming generically angry. Express " +
    "certainty through deliberate choices, measured speech, composure, " +
    "patience, and an unshaken sense of consequence when appropriate " +
    "to this character. Make their reasoning specific to their existing " +
    "beliefs. Power should change the character's manner only when the " +
    "setting and character card establish that power. Do not invent " +
    "abilities, escalate conflict automatically, force violence, or " +
    "control the user's character. Preserve nuance: conviction may be " +
    "quiet, charismatic, cold, righteous, fanatical, or openly arrogant. " +
    "Do not force every trait into every reply.";

function estimateTokens(value) {
    return Math.ceil(value.length / 4);
}

if (estimateTokens(note) > CONFIG.MAX_TOKENS) {
    note = note.slice(0, CONFIG.MAX_TOKENS * 4);
}

context.character.scenario += note;

if (CONFIG.DEBUG) {
    context.character.scenario +=
        "\n" + MARKER + " DEBUG: score=" + score;
}
