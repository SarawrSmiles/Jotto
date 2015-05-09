with open('list-of-words.txt', 'r') as f:
    list1 = f.readlines()

list2 = []

for word in list1:
    word = word.rstrip()
    if len(word) == 5:
        list2.append(word)

f = open('fiveLetterWords.txt', 'w')

for word in list2:
    f.write(word + '\n')

