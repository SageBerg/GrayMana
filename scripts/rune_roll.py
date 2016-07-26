import random

all_spells = "AlertScryAdvertiseCoordinatesHeat MinionCleanLevitateHeatMana ChestQuicknessHealBefriendBurstStorageDetoxGavityHeat WallCloneFlightSleepFound FactionShieldDetect MagicPermanencyDispel MagicPessureSummon FoodTeleportStunInduct to FactionTheshold ShieldLightMana PoolNo Magic ZoneToughenPortalResurrectWeatherSentinelBuildTriggerMessageProfile PersonMap"
spells = ["Clean", "Levitate", "Heat", "Mana Chest", "Quickness", "Heal",
          "Befriend", "Burst", "Storage", "Detox", "Gavity",
          "Heat Wall", "Clone", "Flight", "Sleep", "Found Faction", "Shield",
          "Detect Magic", "Permanency", "Dispel Magic", "Pessure",
          "Summon Food", "Teleport", "Stun", "Induct to Faction",
          "Theshold Shield", "Light", "Mana Pool", "No Magic Zone", "Toughen",
          "Portal", "Resurrect", "Weather", "Sentinel", "Build", "Trigger",
          "Message", "Profile Person", "Map", "Heat Minion", "Alert", "Scry",
          "Advertise", "Coordinates"]

def get_rune_drop():
    rune_drop = list()
    max_runes = 20
    rune_count = 0
    while random.random() < 0.75 and rune_count <= max_runes:
        rune_count += 1
        rune_drop.append(get_random_letter())
    return rune_drop

def get_rune_counts(chests):
    rune_counts = dict()
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

def get_mana_amount():
    roll = random.randint(0,2047)
    if roll < 1024:
        return 10
    elif roll < 1024 + 512:
        return 20
    elif roll < 1024 + 512 + 256:
        return 40
    elif roll < 1024 + 512 + 256 + 128:
        return 80
    elif roll < 1024 + 512 + 256 + 128 + 64:
        return 160
    elif roll < 1024 + 512 + 256 + 128 + 64 + 32:
        return 320
    elif roll < 1024 + 512 + 256 + 128 + 64 + 32 + 16:
        return 640
    elif roll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8:
        return 1280
    elif roll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8 + 4:
        return 2560
    elif roll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8 + 4 + 2:
        return 5120
    else:
        return 0

def get_spells_you_can_learn(chests):
    rune_counts = get_rune_counts(chests)
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

def open_chest():
    mana = get_mana_amount()
    runes = get_rune_drop()
    if random.randint(0,1) == 0:
        wizmarks = get_mana_amount() / 10
    else:
        wizmarks = 0
    mana_colors = ["red", "orange", "yellow", "green", "blue", "indigo",
                   "violet", "black", "gray", "white"]
    mana_color = random.choice(mana_colors)
    print str(mana) + " " + mana_color + " mana"
    if wizmarks == 1:
        print "1 wizmark"
    else:
        print str(wizmarks) + " wizmarks"
    print runes

open_chest()
