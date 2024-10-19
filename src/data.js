export const invaderCards1 = [
  { description: "I. wetland", background: "#acd5d3,#acd5d3" },
  { description: "I. jungle", background: "#97cc97,#97cc97" },
  { description: "I. sand", background: "#e7e7a0,#e7e7a0" },
  { description: "I. mountain", background: "#d3d3d3,#d3d3d3" },
];

export const invaderCards2 = [
  { description: "II. wetland (*)", background: "#acd5d3,#acd5d3" },
  { description: "II. jungle (*)", background: "#97cc97,#97cc97" },
  { description: "II. sand (*)", background: "#e7e7a0,#e7e7a0" },
  { description: "II. mountain (*)", background: "#d3d3d3,#d3d3d3" },
  { description: "II. coastal lands", background: "#acd5d3,#acd5d3" },
];

export const invaderCards3 = [
  { description: "III. mountain+wetland", background: "#d3d3d3,#acd5d3" },
  { description: "III. mountain+jungle", background: "#d3d3d3,#97cc97" },
  { description: "III. jungle + sand", background: "#97cc97,#e7e7a0" },
  { description: "III. jungle + wetland", background: "#97cc97,#acd5d3" },
  { description: "III. sand + wetland", background: "#e7e7a0,#acd5d3" },
  { description: "III. sand + mountain", background: "#e7e7a0,#d3d3d3" },
];

export const fearCards = [
  {
    title: "Emigration Accelerates",
    effect1: "Each player removes 1 explorer from a coastal land",
    effect2: "Each player removes 1 explorer/town from a coastal land",
    effect3: "Each player removes 1 explorer/town from any land",
  },
  {
    title: "Retreat",
    effect1: "Each player may Push up to 2 explorer from an Inland land",
    effect2: "Each player may Push up to 3 explorer/town from an Inland land",
    effect3: "Each player may Push any number of explorer/town from one land",
  },
  {
    title: "Dahan on their guard",
    effect1: "In each land, Defend 1 per Dahan",
    effect2:
      "In each land with Dahan, Defend 1, plus an additional Defend 1 per Dahan",
    effect3: "In each land, Defend 2 per Dahan",
  },
  {
    title: "Trade Suffers",
    effect1: "Invaders do not Build in lands with Cities",
    effect2: "Each player may replace 1 Town with 1 Explorer in a Coastal land",
    effect3:
      "Each player may, in a Coastal land, replace 1 City with 1 Town, or 1 Town with 1 Explorer",
  },
  {
    title: "Overseas Trade seem safer",
    effect1: "Defend 3 in all Coastal lands",
    effect2:
      "Defend 6 in all Coastal lands. Invaders do not Build Cities in Coastal lands this turn",
    effect3:
      "Defend 9 in all Coastal lands. Invaders do not Build in Coastal lands this turn",
  },
  {
    title: "Wary of the Interior",
    effect1: "Each player removes 1 Explorer from an Inland land",
    effect2: "Each player removes 1 Explorer/Town from an Inland land",
    effect3: "Each player removes 1 Explorer/Town from any land",
  },
  {
    title: "Scapegoats",
    effect1: "Each Town destroys 1 Explorer in its land",
    effect2:
      "Each Town destroys 1 Explorer in its land. Each City destroys 2 Explorer in its land",
    effect3:
      "Destroy all Explorer in lands with Town/City. Each City destroys 1 Town in its land",
  },
  {
    title: "Isolation",
    effect1:
      "Each player removes 1 Explorer/Town from a land where it is the only Invader",
    effect2:
      "Each player removes 1 Explorer/Town from a land with 2 or fewer Invaders",
    effect3:
      "Each player removes an Invader from a land with 2 or fewer Invaders",
  },
  {
    title: "Belief takes Root",
    effect1: "Defend 2 in all lands with Presence",
    effect2:
      "Defend 2 in all lands with Presence. Each Spirit gains 1 Energy per Sacred Site they have in lands with Invaders",
    effect3:
      "Each player chooses a different land and removes up to 2 Health worth of Invaders per Presence there",
  },
  {
    title: "Dahan Raid",
    effect1: "Each player chooses a different land with Dahan. 1 Damage there",
    effect2:
      "Each player chooses a different land with Dahan. 1 Damage per Dahan there",
    effect3:
      "Each player chooses a different land with Dahan. 2 Damage per Dahan there",
  },
  {
    title: "Dahan Enheartened",
    effect1:
      "Each player may Push 1 Dahan from a land with invaders or Gather 1 Dahan into a land with Invaders",
    effect2:
      "Each player chooses a different land. In chosen lands: Gather up to 2 Dahan, then 1 Damage if Dahan are present",
    effect3:
      "Each player chooses a different land. In chosen lands: Gather up to 2 Dahan, then 1 Damage per Dahan present",
  },
  {
    title: "Tall Tales of Savagery",
    effect1: "Each player removes 1 Explorer from a land with Dahan",
    effect2: "Each player removes 2 Explorer or 1 Town from a land with Dahan",
    effect3:
      "Remove 2 Explorer or 1 Town from each land with Dahan. Then, remove 1 City from each land with at least 2 Dahan",
  },
  {
    title: "Avoid the Dahan",
    effect1: "Invaders do not Explore into lands with at least 2 Dahan",
    effect2: "Invaders do not Build in lands where Dahan outnumber Town/City",
    effect3: "Invaders do not Build in lands with Dahan",
  },
  {
    title: "Seek Safety",
    effect1:
      "Each player may Push 1 Explorer into a land with more Town/City than the land it came from",
    effect2:
      "Each player may Gather 1 Explorer into a land with Town/City, or Gather 1 Town into a land with City",
    effect3:
      "Each player may remove up to 3 Health worth of Invaders from a land without City",
  },
  {
    title: "Fear of the Unseen",
    effect1:
      "Each player removes 1 Explorer/Town from a land with a Sacred Site",
    effect2: "Each player removes 1 Explorer/Town from a land with Presence",
    effect3:
      "Each player removes 1 Explorer/Town from a land with Presence, or 1 City from a land with Sacred Site",
  },
  // Jagged Earth cards
  {
    title: "Sense of Dread",
    effect1:
      "On Each Board: remove 1 Explorer from a land matching a Ravage Card",
    effect2:
      "On Each Board: remove 1 Explorer/Town from a land matching a Ravage Card",
    effect3:
      "On Each Board: remove 1 invader from a land matching a Ravage Card",
  },
  {
    title: "Flee from Dangerous Lands",
    effect1:
      "On Each Board: push 1 Explorer/Town from a land with Badlands/Wilds/Dahan",
    effect2:
      "On Each Board: remove 1 Explorer/Town from a land with Badlands/Wilds/Dahan",
    effect3:
      "On Each Board: remove 1 Explorer/Town from any land, or remove 1 City from a land with Badlands/Wilds/Dahan",
  },
  {
    title: "Dahan reclaim Fishing Grounds",
    effect1:
      "Each player chooses a different Coastal land with Dahan. In each: 1 Damage per Dahan",
    effect2:
      "Each player chooses a different Coastal land. In each: gather up to 1 Dahan, 1 Damage per Dahan",
    effect3:
      "Each player chooses a different Coastal land. In each: gather up to 1 Dahan, 2 Damage per Dahan",
  },
  {
    title: "Beset by many Troubles",
    effect1: "In each land with Badlands/Wilds/Disease/Beasts/Strife, Defend 3",
    effect2:
      "In each land with Badlands/Wilds/Disease/Beasts/Strife, or adjacent to 3 or more such tokens, Defend 5",
    effect3:
      "Every Badlands/Wilds/Disease/Beasts/Strife grants Defend 3 in its land and adjacent lands",
  },
  {
    title: "Nerves Fray",
    effect1: "Each player adds 1 Strife in a land not matching a Ravage Card",
    effect2:
      "Each player adds 2 Strife in a single land not matching a Ravage Card",
    effect3:
      "Each player adds 2 Strife in a single land not matching a Ravage Card. 1 Fear per player.",
  },
  {
    title: "Theological Strife",
    effect1: "Each player adds 1 Strife in a land with presence",
    effect2:
      "Each player adds 1 Strife in a land with presence. Each Spirit gains 1 Energy per Sacred Site they have in lands with Invaders",
    effect3:
      "Each players adds 1 Strife in a land with presence. Then, each invader with Strife deals Damage to other invaders in its land",
  },
];

export const blightCards = [
  {
    title: "Downward Spiral",
    blightCount: 5,
    description:
      "At the start of each Invader Phase, each Spirit destroys 1 of their Presence",
  },
  {
    title: "Memory fades to dust",
    blightCount: 4,
    description:
      "At the start of each Invader Phase, each Spirit forgets a power or destroys 1 of their Presence",
  },
  // Jagged Earth cards
  {
    title: "Unnatural Proliferation",
    blightCount: 3,
    description:
      "Immediately, each Spirit adds 1 presence to a land with their presence. On Each Board: add 1 Dahan to a land with Dahan, and 2 Cities to the land with fewest Town/City (min 1)",
  },
  {
    title: "All things weaken",
    blightCount: 3,
    description:
      "Ongoing, starting next turn: Invaders and Dahan have -1 Health (min 1). The land takes blight on 1 less damage (normally 1). When you add blight, it destroys all Presence/Beasts in that land and 1 presence (total) in an adjacent land.",
  },
  {
    title: "Thriving Communities",
    blightCount: 4,
    description:
      "Immediately, on each board: in 4 different lands with Explorer/Dahan, replace 1 Town with 1 City or replace 1 Explorer with 1 Town",
  },
  {
    title: "Power Corrodes the Spirit",
    blightCount: 4,
    description:
      "At the start of each Invader Phase, each Spirit destroys 1 of their presence if they have 3 or more power cards in play, or have a power card in play costing 4 or more (printed) energy",
  },
  {
    title: "Untended Land Crumbles",
    blightCount: 4,
    description:
      "At the start of each invader phase, on each board: add 1 blight to a land adjacent to blight. Spirits may prevent this on any/all boards; each board to be protected requires jointly paying 3 energy or destroying 1 presence from that board",
  },
  {
    title: "Invaders find the land to their liking",
    staysHealthy: true,
    blightCount: 2,
    description:
      "Immediately: if the terror level is 1/2/3, add 1/1.5/2 Fear markers per player to the fear pool (rounded down)",
  },
  {
    title: "Strong Earth shatters slowly",
    staysHealthy: true,
    blightCount: 2,
    description:
      "Immediately: Each player adds 1 Blight (from this card) to a land adjacent to Blight",
  },
];
