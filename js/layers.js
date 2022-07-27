addLayer("cp", {
    name: "Challenge Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		power: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Challenge Points",
effectDescription() {
return "Endgame: 128th Challenge, each 5 of Challenge Points forming a challenge (scales up to 25 after 2nd challenge"},	// Name of prestige currency
    baseResource: "particles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.55, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (inChallenge("dr", 11)) mult = mult.div(1.74) 
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
		challenges: {
    11: {
        name: "1. Pointer",
        challengeDescription: "Point gain is x0.8 slower.",
        canComplete: function() {return player.points.gte(100)},
		unlocked() {return player.cp.points.gte(5)},
		goalDescription: " 100 Particles",
		rewardDescription: "Point gain is x20.15 faster",
    },
	    12: {
        name: "2. Booster",
        challengeDescription: "Point gain is slower by CP amount",
        canComplete: function() {return player.points.gte(300)},
		unlocked() {return player.cp.points.gte(10)},
		goalDescription: " 300 Particles",
		rewardDescription() {return "Point amount boosts themselves gain. Currently: " + format(player.points.pow(0.24).add(1)) + "x"},
    },
		    13: {
        name: "3. Scaler",
        challengeDescription: "Divides point gain by completed challenges",
        canComplete: function() {return player.points.gte(3450)},
		unlocked() {return player.cp.points.gte(35)},
		goalDescription: " 3450 Particles",
		rewardDescription: "Unlock a new layer",
    },
},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "c: Reset for Challenge Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	layerShown(){return true},
})
addLayer("dr", {
    name: "Dimensional Rift", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#523e8b",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Dimensional Rift",	// Name of prestige currency
    baseResource: "challenge points",
branches: ["cp"],	// Name of resource prestige is based on
    baseAmount() {return player.cp.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
		challenges: {
    11: {
        name: "4. 1st dimension",
        challengeDescription: "CP gain is 1.74x slower",
        canComplete: function() {return player.cp.points.gte(85)},
		unlocked() {if (hasChallenge('dr', 21)) return false
			return true},
		goalDescription: " 85 Challenge Points",
		rewardDescription: "Unlock 2 challenges, which can unlock one more layer",
    },
	    12: {
        name: "5. 2nd dimension",
        challengeDescription: "CP gain is 1.74x slower and point gain is 1.24x slower",
        canComplete: function() {return player.cp.points.gte(155)},
		unlocked() {if (hasChallenge('dr', 21)) return false
			return hasChallenge("dr", 11)},
		goalDescription: " 155 Challenge Points",
		rewardDescription: "Unlock challenge and provide 2.15x boost to point gain",
    },
		    12: {
        name: "6. 3nd dimension",
        challengeDescription: "",
        canComplete: function() {return player.cp.points.gte(155)},
		unlocked() {if (hasChallenge('dr', 21)) return false
			return hasChallenge("dr", 12)},
		goalDescription: " 155 Challenge Points",
		rewardDescription: "Unlock next challenge and provide <b>Power</b>",
    },
		    21: {
        name: "13. Collapse all dimensions",
        challengeDescription: "Just click at this challenge",
        canComplete: function() {return player.cp.points.gte(0)},
		unlocked() {return hasChallenge("dr", 11)},
		goalDescription: " 0 Challenge Points",
		rewardDescription: "Unlock a new layer, but destroy this layer",
    },
},
update(diff) {
	let player.dr.power = player.dr.power.add(diff)
},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "c: Reset for Challenge Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	layerShown(){if (hasChallenge('dr', 21)) return "ghost"
		return hasChallenge("cp", 13) || player[this.layer].unlocked},
})