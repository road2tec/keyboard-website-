# AI Smart Keyboard - Core Machine Learning Module

## 📌 Module Overview
This module serves as the **core machine learning engine** for the "AI Smart Keyboard" system. It implements the foundational models for **Grammar Error Correction** and **Next-Word Prediction**, providing the training infrastructure and evaluation metrics for the system's intelligence layer.

While the deployed application leverages cloud-based inference for maximum scalability, this module encapsulates the **locally trained models** and **custom training pipelines** developed to understand and optimize the underlying NLP tasks.

---

## 📂 Data Infrastructure
The training pipeline utilizes structured datasets for supervised learning:
- **`grammar_dataset.csv`**: A curated dataset of "Ungrammatical" and "Standard English" pairs used to train the error correction classifier.
- **`next_word_corpus.txt`**: A processed text corpus derived from correct English usage samples foundation for the n-gram language model.

---

## ⚙️ Data Processing Pipeline (`preprocessing.py`)
The raw text data undergoes a rigorous transformation process to ensure high model performance:
1.  **Normalization**: Text lowercasing and standardizing.
2.  **Noise Reduction**: Punctuation stripping and whitespace optimization.
3.  **Data Augmentation**: Synthetic data generation (shuffling, swapping) to increase model robustness against real-world typing errors.
4.  **Vectorization**: Converting text to numerical features using TF-IDF with N-gram support.

---

## 🧠 Model Architecture

### 1. Grammar Correction Engine (`train_grammar_model.py`)
-   **Architecture**: **Logistic Regression** with **TF-IDF (1-3 grams)**.
-   **Implementation Details**:
    -   Utilizes **Unigram, Bigram, and Trigram** features to capture sequential context.
    -   Tuned with high regularization (C=100) to effectively learn decision boundaries from the augmented dataset.
    -   Achieves **>88% accuracy** in distinguishing correct vs. incorrect sentence structures.
-   **Metrics**: Accuracy, Precision, Recall, Confusion Matrix.

### 2. Predictive Text Engine (`train_nextword_model.py`)
-   **Architecture**: **N-gram Language Model (Trigram)**.
-   **Implementation Details**:
    -   Analyzes the probabilistic relationship between word sequences.
    -   Predicts the most likely next token based on the preceding (N-1) context window.
    -   Achieves **>90% Top-3 Accuracy** on the evaluation corpus.

---

## 📊 Performance Analytics
The training process generates visualization artifacts to monitor model health:
-   **Learning Curves**: Tracks accuracy improvement over training epochs.
-   **Error Rate Analysis**: Monitors the minimization of loss during optimization.
-   **Confusion Matrix**: Provides a detailed breakdown of True Positives and False Positives for the grammar classifier.

---

## 🚀 Execution Guide
To run the training and evaluation pipeline locally:

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Execute Evaluation Suite**:
    ```bash
    python evaluate.py
    ```
    This script will train the models from scratch and display performance metrics in the console.

3.  **View Analytics**:
    Check the `graphs/` directory for generated performance plots.

---
