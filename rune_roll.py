import random

rune_counts = {}

for i in range(100):
    rune_count = 0
    while random.random() < 0.75:
        rune_count += 1

    if rune_count in rune_counts:
        rune_counts[rune_count] += 1
    else:
        rune_counts[rune_count] = 1

for count in rune_counts:
    try:
        print count, rune_counts[count]
    except:
        pass
