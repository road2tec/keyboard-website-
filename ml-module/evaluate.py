import train_grammar_model
import train_nextword_model
import preprocessing
import sys

def main():
    print("========================================")
    print("   AI SMART KEYBOARD - ML MODULE")
    print("   Academic Demonstration")
    print("========================================")
    
    print("\n[TASK 1 & 2] Loading and Preprocessing Data...")
    # This is handled inside train_grammar_model
    
    print("\n[TASK 3 & 5 & 6] Training Grammar Model & Generating Graphs...")
    grammar_model, vectorizer = train_grammar_model.train_grammar()
    
    print("\n[TASK 4] Training Next-Word Prediction Model...")
    nextword_model = train_nextword_model.train_nextword()
    
    print("\n========================================")
    print("   FINAL EVALUATION DEMO")
    print("\n" + "="*40)
    print("   TRAINING MARATHI MODEL")
    print("="*40)
    marathi_model = train_nextword_model.train_nextword(lang='marathi')

    print("\n" + "="*40)
    print("   FINAL EVALUATION DEMO")
    print("="*40)
    
    # English Demo
    print("\n1. English Grammar Checker:")
    grammar_tests = [
        "She go to the store.",
        "I am learning machine learning.",
        "The cat drink milk.",
        "They are playing soccer."
    ]
    for text in grammar_tests:
        vec_text = vectorizer.transform([preprocessing.clean_text(text)])
        pred = grammar_model.predict(vec_text)[0]
        label = "Correct" if pred == 1 else "Incorrect"
        print(f"   Input: '{text}' -> Classification: {label}")

    print("\n2. English Next Word Prediction:")
    nw_tests = ["the sun", "she is", "i am"]
    for text in nw_tests:
        preds = nextword_model.predict(text)
        print(f"   Input: '{text}' -> Suggestions: {preds}")
        
    print("\n3. Marathi Next Word Prediction (Multilingual Demo):")
    marathi_tests = ["मी", "शुभ", "भारत"]
    if marathi_model:
        for text in marathi_tests:
            preds = marathi_model.predict(text)
            print(f"   Input: '{text}' -> Suggestions: {preds}")
        
    print("\n[INFO] Graphs have been saved to 'ml-module/graphs/'")
    print("[INFO] Module execution complete.")

if __name__ == "__main__":
    main()
