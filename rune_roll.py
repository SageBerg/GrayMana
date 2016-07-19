import random

all_spells = "CleanLevitateHeatMana ChestSpeedHealBefriendBurstStorageDetoxGavityHeat WallCloneFlightSleepFound FactionShieldDetect MagicPermanencyDispel MagicPessureSummon FoodTeleportStunInduct to FactionTheshold ShieldLightMana PoolNo Magic ZoneToughenPropelResurrectSanctuarySentinelAlertTriggerMessageProfile PersonMap"
spells = ["Clean", "Levitate", "Heat", "Mana Chest", "Speed", "Heal",
          "Befriend", "Burst", "Storage", "Detox", "Gavity",
          "Heat Wall", "Clone", "Flight", "Sleep", "Found Faction", "Shield",
          "Detect Magic", "Permanency", "Dispel Magic", "Pessure",
          "Summon Food", "Teleport", "Stun", "Induct to Faction",
          "Theshold Shield", "Light", "Mana Pool", "No Magic Zone", "Toughen",
          "Propel", "Resurrect", "Sanctuary", "Sentinel", "Alert", "Trigger",
          "Message", "Profile Person", "Map"]


def get_rune_drop():
    rune_drop = list()
    while random.random() < 0.75:
        rune_drop.append(get_random_letter())
    return rune_drop

def get_rune_counts():
    rune_counts = dict()
    chests = 10  #how many chests you'd need to open to get your result in game
    for _ in range(chests):
        rune_drop = get_rune_drop()
        for rune in rune_drop:
            if rune in rune_counts:
                rune_counts[rune] += 1
            else:
                rune_counts[rune] = 1
    return rune_counts

def get_random_letter():
    return all_spells[random.randint(0, len(all_spells) - 2)].lower()

def get_spells_you_can_learn():
    rune_counts = get_rune_counts()
    spells_you_can_learn = []
    for spell in spells:
        temp_rune_counts = rune_counts.copy()
        spell = spell.lower()
        can_learn = True
        for letter in spell:
            if letter in temp_rune_counts and temp_rune_counts[letter] > 0:
                temp_rune_counts[letter] -= 1
            else:
                can_learn = False
        if can_learn:
            spells_you_can_learn.append(spell)
    return spells_you_can_learn

print get_spells_you_can_learn()
