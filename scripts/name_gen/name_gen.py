from random import choice
from random import randint


CONSONANTS = ['b', 'd', 'f', 'gh', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's',
              't', 'v', 'w', 'y', 'z', 'sh', 'kw', 'ch', 'th',]
CONSONANTS_THAT_CAN_COME_AFTER_S = ['k', 'l', 'm', 'n', 'p', 'r', 't', 'v', 'w']

CONSONANTS_THAT_CAN_COME_BEFORE_R = set(['b', 'd', 'f', 'gh', 'k', 'p', 't', 'v',
                                     'sh', 'th'])
CONSONANTS_THAT_CAN_COME_BEFORE_L = set(['b', 'f', 'gh', 'k', 'p', 'v'])
EXTRA_CONSONANTS = ['b', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's',
                    't', 'v', 'w', 'y', 'z', 'ng']
VOWELS = ['a', 'e', 'i', 'o', 'u', 'ee', 'oo', 'ai', 'io', 'ou', 'ie']

def get_number_of_sylables():
    return choice([2, 2, 2, 2, 2, 3])

def random_consonant():
    consonant = CONSONANTS[randint(0, len(CONSONANTS) - 1)]
    if consonant in CONSONANTS_THAT_CAN_COME_BEFORE_R and randint(0,4) == 0:
        if consonant == 'gh':
            consonant = 'gr'
        else:
            consonant += 'r'
    elif consonant in CONSONANTS_THAT_CAN_COME_BEFORE_L and randint(0,4) == 0:
        if consonant == 'gh':
            consonant = 'gl'
        else:
            consonant += 'l'
    elif (consonant == 's'):
        if (randint(0,2) == 0):
            consonant += CONSONANTS_THAT_CAN_COME_AFTER_S[
                randint(0, len(CONSONANTS_THAT_CAN_COME_AFTER_S) - 1)
            ]
    return consonant

def random_vowel():
    return VOWELS[randint(0, len(VOWELS) - 1)]

def extra_consonant_maybe():
    if (randint(0,1) == 0):
        return EXTRA_CONSONANTS[randint(0, len(EXTRA_CONSONANTS) - 1)]
    return ''

def gen_name(ending_vowel):
    number_of_sylables = get_number_of_sylables()
    name = ''
    for _ in range(number_of_sylables - 1):
        name += random_consonant() + random_vowel() + extra_consonant_maybe()
    name += random_consonant() + ending_vowel
    name = name[0].upper() + name[1:]
    return name

def gen_woman_name():
     return gen_name('a')


def gen_man_name():
    return gen_name('o')

for _ in range(10):
    print gen_woman_name()
    print gen_man_name()
    print
