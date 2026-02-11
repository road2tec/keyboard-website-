import pandas as pd
import os

def generate_corpus():
    input_csv = 'dataset/grammar_dataset.csv'
    output_txt = 'dataset/next_word_corpus.txt'
    
    if not os.path.exists(input_csv):
        print(f"Error: {input_csv} not found.")
        return

    try:
        df = pd.read_csv(input_csv)
        # Use simple English column for corpus
        sentences = df['Standard English'].dropna().unique()
        
        full_text = " ".join(sentences)
        
        with open(output_txt, 'w', encoding='utf-8') as f:
            f.write(full_text)
            
        print(f"Successfully generated {output_txt} from dataset.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_corpus()
