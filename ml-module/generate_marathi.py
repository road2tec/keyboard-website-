import random

subjects = ["मी", "तू", "तो", "ती", "आम्ही", "तुम्ही", "ते", "त्या", "राम", "सीता", "महेश", "विद्यार्थी", "शिक्षक", "शेतकरी", "आई", "बाबा"]
objects = ["शाळेत", "घरी", "गावात", "पुण्यात", "मुंबईत", "कामावर", "बागेत", "बाजारात", "दुकानात", "मैदानावर", "सातारला", "कोल्हापूरला"]
verbs = ["जातो", "जाते", "खातो", "खाते", "पाहतो", "पाहते", "करतो", "करते", "आहे", "होतो", "येतो", "येते", "बसतो", "बसते", "चालतो", "चालते", "पळतो", "लिहितो", "वाचतो"]
adjectives = ["सुंदर", "हुशार", "मोठा", "लहान", "चांगला", "वाईट", "नवीन", "जुना", "कठीण", "सोपा", "वेगाचा", "हळू", "गोड", "तिखट"]
nouns = ["आंबा", "पोळी", "भाजी", "पुस्तक", "पेन", "गाडी", "पाणी", "दूध", "चहा", "कॉफी", "काम", "अभ्यास", "खेळ", "गाणे"]

# Common phrases start
starters = ["मला", "तिला", "त्याला", "आम्हाला"]
needs = ["पाहिजे", "हवे आहे", "आवडते", "समजते", "वाटते"]

def generate_marathi_lines(num_lines=5000):
    lines = []
    
    for _ in range(num_lines):
        structure = random.choice([1, 2, 3, 4])
        
        if structure == 1:
            # S + O + V (e.g., मी शाळेत जातो)
            s = random.choice(subjects)
            o = random.choice(objects)
            v = random.choice(verbs)
            lines.append(f"{s} {o} {v}")
            
        elif structure == 2:
            # S + N + V (e.g., राम आंबा खातो)
            s = random.choice(subjects)
            n = random.choice(nouns)
            v = random.choice(verbs)
            lines.append(f"{s} {n} {v}")
            
        elif structure == 3:
            # N + Adj + V/Aux (e.g., हे फूल सुंदर आहे)
            n = random.choice(nouns)
            adj = random.choice(adjectives)
            lines.append(f"हे {n} {adj} आहे")
            
        elif structure == 4:
            # Starter + N + Need (e.g., मला पाणी पाहिजे)
            st = random.choice(starters)
            n = random.choice(nouns)
            ne = random.choice(needs)
            lines.append(f"{st} {n} {ne}")
            
    return lines

if __name__ == "__main__":
    print("Generating Marathi Corpus...")
    corpus = generate_marathi_lines(5000)
    
    with open("dataset/marathi_corpus.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(corpus))
        
    print(f"Successfully generated {len(corpus)} sentences in dataset/marathi_corpus.txt")
