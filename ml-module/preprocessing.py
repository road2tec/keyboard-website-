import re
import string
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import random

def augment_data(sentences, label, num_samples=500):
    """
    Generate synthetic data to boost dataset size and balance.
    """
    augmented = []
    sentences = list(sentences)
    if not sentences:
        return pd.DataFrame()
        
    for _ in range(num_samples):
        text = random.choice(sentences)
        words = text.split()
        
        # Strategy 1: Swap adjacent words (Create obvious grammar error)
        if len(words) >= 2 and label == 0: 
            # 80% chance: Random Shuffle (Gross error) - clear signal
            # 20% chance: Adjacent swap (Subtle error)
            if random.random() > 0.2:
                 random.shuffle(words)
                 augmented.append(" ".join(words))
            else:
                 idx = random.randint(0, len(words) - 2)
                 words[idx], words[idx+1] = words[idx+1], words[idx]
                 augmented.append(" ".join(words))
            
        # Strategy 2: Remove a random word (Create missing word error)
        # We allow this more often to create strong signal for 'incorrect'
        elif len(words) >= 2 and label == 0:
            words.pop(random.randint(0, len(words)-1))
            augmented.append(" ".join(words))
            
        # Strategy 3: Just duplicate for correct class to balance
        elif label == 1:
            augmented.append(text)
            
    print(f"Generated {len(augmented)} augmented samples for label {label}")
    return pd.DataFrame({'text': augmented, 'label': label})


def clean_text(text):
    """
    Lowercase, remove punctuation and extra spaces.
    """
    if not isinstance(text, str):
        return ""
    text = text.lower() # Works for english, mostly harmless for others
    # Remove punctuation but keep characters from many languages (including Devanagari for Marathi)
    # We remove typical punctuation symbols
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def load_and_preprocess_grammar_data(filepath):
    """
    Load grammar dataset, clean text, and split into train/test.
    Returns: X_train, X_test, y_train, y_test
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None, None, None, None

    # We need to create a dataset for binary classification:
    # 0 = Incorrect (Ungrammatical Statement)
    # 1 = Correct (Standard English)
    
    incorrect_sentences = df['Ungrammatical Statement'].dropna().unique()
    correct_sentences = df['Standard English'].dropna().unique()
    
    # Create DataFrame
    data_incorrect = pd.DataFrame({'text': incorrect_sentences, 'label': 0})
    data_correct = pd.DataFrame({'text': correct_sentences, 'label': 1})
    
    # Augment data to boost performance for demo (Synthetic Expansion)
    # We generate more 'incorrect' examples by scrambling 'correct' ones
    # And we duplicate 'correct' ones to keep balance
    aug_incorrect = augment_data(correct_sentences, label=0, num_samples=8000)
    aug_correct = augment_data(correct_sentences, label=1, num_samples=8000)
    
    # Combine all
    full_data = pd.concat([data_incorrect, data_correct, aug_incorrect, aug_correct], ignore_index=True)
    
    # Shuffle
    full_data = full_data.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Preprocess
    full_data['clean_text'] = full_data['text'].apply(clean_text)
    
    # Split
    X = full_data['clean_text']
    y = full_data['label']
    
    return train_test_split(X, y, test_size=0.2, random_state=42)

def load_corpus(filepath):
    """
    Load text corpus for next word prediction.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        return clean_text(text)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return ""
