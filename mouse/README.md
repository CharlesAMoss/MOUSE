# MOUSE Tokenization App

This app provides a user-friendly interface for uploading or entering text, then tokenizing it into meaningful units for further processing. 

## Features
- Upload `.txt` files or enter text manually
- Tokenization by words, punctuation, whitespace, and special characters (expansion planned)
- View token count, sample tokens, and download output as JSON
- Responsive UI with accessibility features
- Modular architecture for easy extension

## Planned Expansion
- Advanced tokenization using configurable regular expressions
- Token type assignment (word, punctuation, whitespace, special)
- UI options for selecting tokenization mode
- Unit tests for robust token identification
## Input IDs (token ids)

- The app can optionally include `input_ids` in the exported JSON. These are numeric ids assigned to each token value by an in-repo vocabulary encoder.
- Toggle "Include input_ids" in the Tokenization UI to enable this feature. The downloaded JSON will then include `input_ids` alongside `tokens` for downstream use.

Note: This uses a simple dynamic vocabulary. For production workflows you may prefer integrating a pretrained subword tokenizer (e.g., Hugging Face Tokenizers or tiktoken) to match model tokenization.

## How It Works
1. User uploads a text file or enters text
2. The app tokenizes the input using the current logic (whitespace/punctuation)
3. Token count and sample tokens are displayed
4. Output can be downloaded as a JSON file for downstream use

## Sentence Boundary Detection

- The app automatically detects sentence boundaries and groups tokens by sentence.
- Sentence detection uses punctuation (`.`, `!`, `?`) followed by whitespace and capitalized words.
- The exported JSON includes a `sentences` array with sentence ID, text, and token details for each sentence.
- This enables downstream text analysis tasks like summarization, sentiment analysis, and NLP pipelines.

## Implementation Summary

### Stage 1-6: Core Tokenization (Completed)
- Regex-based tokenization with 5 token types (word, number, punctuation, whitespace, special)
- UI mode selection (basic/advanced)
- Unit tests with 100% pass rate
- Input_ids implementation with dynamic vocabulary encoder
- Full documentation and integration tests

### Stage 7: Sentence Boundary Detection (Completed)
- Created `sentenceBoundary.ts` with `detectSentences()` and `groupBySentence()` functions
- Detects sentence endings based on terminal punctuation followed by capitalization or end of text
- Comprehensive unit tests (3 test cases, all passing)
- Integrated into TokenizationComponent UI (shows sentence count)
- Sentences included in JSON export with structure: `{ id, text, tokens[] }`

## Future Expansion Roadmap

The following phases outline optional advanced features that can be implemented to extend the tokenization system into a comprehensive NLP analysis platform.

---

### **Phase 8: Filtering & Statistical Analysis**

**Objective:** Provide configurable filtering and statistical analysis capabilities for different token types.

#### Sub-stages:

**8.1 - Token Filtering Engine**
- **File:** `src/utils/tokenFilter.ts`
- **Implementation:**
  - Create `filterTokens(tokens, options)` function with options:
    - `includeTypes: TokenType[]` - whitelist specific types
    - `excludeTypes: TokenType[]` - blacklist specific types
    - `includeStopwords: boolean` - toggle common word filtering
    - `caseSensitive: boolean` - case handling for deduplication
  - Load stopwords list (common words like "the", "a", "is") from `data/stopwords.json`
  - Return filtered token array with metadata about what was removed
- **Tests:** `tokenFilter.test.ts` - verify filtering logic, edge cases (empty input, all filtered)
- **UI Integration:** Add checkboxes/dropdown in TokenizationComponent for filter selection

**8.2 - Word Count & Vocabulary Builder**
- **File:** `src/utils/statistics.ts`
- **Implementation:**
  - `getWordCount(tokens)` - count only "word" type tokens (excluding punctuation/whitespace)
  - `buildVocabulary(tokens, options)` - extract unique words with options:
    - `minFrequency: number` - minimum occurrences to include
    - `caseSensitive: boolean`
    - `excludeStopwords: boolean`
  - Return `Map<string, number>` of word → frequency
  - `getTopWords(vocab, n)` - get top N most frequent words
- **Output:** Add to JSON export:
  ```json
  {
    "statistics": {
      "word_count": 150,
      "unique_words": 87,
      "vocabulary": { "hello": 3, "world": 2 },
      "top_words": [["hello", 3], ["world", 2]]
    }
  }
  ```
- **Tests:** Verify counts, vocabulary building, frequency sorting
- **UI:** Display word count, unique word count, top 10 words in summary panel

**8.3 - Numeric Analysis**
- **File:** Add to `src/utils/statistics.ts`
- **Implementation:**
  - `extractNumbers(tokens)` - filter "number" type tokens and convert to numeric values
  - `analyzeNumbers(numbers)` - compute statistics:
    - Count, sum, mean, median, min, max
    - Distribution histogram (optional)
  - `detectPatterns(tokens)` - identify numeric patterns:
    - Dates (MM/DD/YYYY)
    - Phone numbers (XXX-XXX-XXXX)
    - Currency ($XXX.XX)
- **Output:** Add to JSON:
  ```json
  {
    "numeric_analysis": {
      "numbers": [1, 2, 3, 100],
      "count": 4,
      "sum": 106,
      "mean": 26.5,
      "patterns": {
        "dates": ["01/01/2025"],
        "phone_numbers": []
      }
    }
  }
  ```
- **Tests:** Number extraction, statistics calculations, pattern detection
- **UI:** Show numeric summary in expandable panel

**Dependencies:** Stages 1-7 (core tokenization, types, sentences)

**Estimated Effort:** Medium (1-2 days)

---

### **Phase 9: Syntax Highlighting & Visualization**

**Objective:** Add visual representation of token types and sentence structure for improved readability and debugging.

#### Sub-stages:

**9.1 - Token Type Color Coding**
- **File:** `src/components/TokenVisualizer.tsx`
- **Implementation:**
  - New React component to render tokens with color coding:
    - Words: `#2563eb` (blue)
    - Numbers: `#16a34a` (green)
    - Punctuation: `#6b7280` (gray)
    - Whitespace: `#e5e7eb` (light gray background)
    - Special: `#dc2626` (red)
  - Render as inline `<span>` elements with hover tooltips showing token type
  - Optional monospace font for technical view
- **CSS:** `TokenVisualizer.css` with `.token-word`, `.token-number`, etc. classes
- **Props Interface:**
  ```typescript
  interface TokenVisualizerProps {
    tokens: Token[];
    colorScheme?: 'default' | 'dark' | 'high-contrast';
    showWhitespace?: boolean;
    interactive?: boolean; // click token to highlight all same type
  }
  ```
- **Tests:** Snapshot tests for rendering, accessibility (color contrast ratios)
- **UI:** Add "Show Visualizer" toggle in TokenizationComponent

**9.2 - Sentence Structure View**
- **File:** Add mode to `TokenVisualizer.tsx`
- **Implementation:**
  - Render tokens grouped by sentence with visual separators
  - Highlight sentence boundaries with vertical bars or boxes
  - Show sentence numbers as labels
  - Indent nested structures (future: detect clauses)
- **Interactive Features:**
  - Click sentence to highlight all tokens in that sentence
  - Hover to show sentence metadata (word count, sentiment score)
  - Expand/collapse long sentences
- **Layout:** CSS Grid or Flexbox for responsive sentence cards
- **Tests:** Verify sentence grouping, interaction handlers

**9.3 - Token Heatmap (Advanced)**
- **File:** `src/components/TokenHeatmap.tsx`
- **Implementation:**
  - Visual heatmap of token frequency across document
  - Color intensity based on occurrence count
  - Horizontal scrollable view for long documents
  - Zoom controls for detail levels
- **Use Cases:**
  - Identify repetitive sections
  - Visualize token distribution
  - Highlight rare/unique tokens
- **Library:** Consider D3.js or Recharts for visualization
- **Tests:** Rendering tests, interaction tests

**Dependencies:** Stages 1-7, Phase 8.2 (vocabulary/frequency)

**Estimated Effort:** Medium-High (2-3 days)

---

### **Phase 10: NLP Feature Extensions**

**Objective:** Extend token types to include linguistic features for natural language understanding.

#### Sub-stages:

**10.1 - Part-of-Speech (POS) Tagging**
- **File:** `src/utils/posTagging.ts`
- **Implementation:**
  - Extend `TokenType` to include POS tags:
    ```typescript
    type POSTag = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection';
    type ExtendedToken = Token & { pos?: POSTag };
    ```
  - **Option A - Rule-Based (Simple):**
    - Create word lists for each POS category (`data/pos-dictionaries/`)
    - Lookup token in dictionaries, assign tag
    - Use context rules (e.g., word after "the" is likely noun)
  - **Option B - ML-Based (Advanced):**
    - Integrate lightweight POS tagger library (e.g., `compromise`, `wink-pos-tagger`)
    - Train custom model on labeled data (Penn Treebank format)
  - Add `tagPOS(tokens)` function returning tokens with POS tags
- **Output:** Add to JSON:
  ```json
  {
    "tokens": [
      { "value": "Hello", "type": "word", "pos": "interjection" },
      { "value": "world", "type": "word", "pos": "noun" }
    ]
  }
  ```
- **Tests:** POS accuracy tests against labeled examples
- **UI:** Toggle "Include POS tags", show in token visualizer with badge

**10.2 - Named Entity Recognition (NER)**
- **File:** `src/utils/nerDetection.ts`
- **Implementation:**
  - Detect named entities using patterns:
    - **Proper nouns:** Capitalized words (not sentence-start)
    - **Locations:** City/country names from dictionary
    - **Organizations:** Multi-word capitalized phrases
    - **Dates/Times:** Numeric patterns (Phase 8.3)
    - **People:** Title + capitalized name (Mr./Dr./Ms. + Name)
  - Create entity type enum:
    ```typescript
    type EntityType = 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'DATE' | 'TIME' | 'OTHER';
    type EntityToken = Token & { entity?: { type: EntityType, confidence: number } };
    ```
  - `detectEntities(tokens)` returns tokens with entity annotations
  - Group multi-token entities (e.g., "New York" as single location)
- **Data:** Load entity dictionaries from `data/entities/` (names, places, orgs)
- **Output:** Add to JSON:
  ```json
  {
    "entities": [
      { "text": "John Smith", "type": "PERSON", "tokens": [5, 6], "confidence": 0.95 }
    ]
  }
  ```
- **Tests:** NER precision/recall on test examples
- **UI:** Highlight entities with underlines, show entity type in tooltip

**10.3 - Sentiment Analysis**
- **File:** `src/utils/sentimentAnalysis.ts`
- **Implementation:**
  - **Punctuation-based sentiment:**
    - Count exclamation marks (excitement/anger)
    - Count question marks (uncertainty/inquiry)
    - Ellipsis patterns (hesitation)
    - ALL CAPS words (emphasis/shouting)
  - **Lexicon-based sentiment:**
    - Load sentiment dictionaries (positive/negative words)
    - Score each word: positive (+1), negative (-1), neutral (0)
    - Compute sentence-level and document-level scores
  - **Emoji detection:** Extend tokenizer to capture emoji as special tokens
  - `analyzeSentiment(tokens, sentences)` returns:
    ```typescript
    {
      document_sentiment: { score: 0.6, label: 'positive' },
      sentence_sentiments: [
        { sentenceId: 0, score: 0.8, label: 'positive' },
        { sentenceId: 1, score: -0.2, label: 'negative' }
      ],
      features: {
        exclamation_count: 5,
        question_count: 2,
        caps_words: ['AMAZING', 'WOW']
      }
    }
    ```
- **Data:** Load from `data/sentiment/positive.txt`, `data/sentiment/negative.txt`
- **Tests:** Sentiment scoring accuracy, edge cases (sarcasm, negation)
- **UI:** Show sentiment score with emoji indicator (😊/😐/😞), per-sentence heatmap

**Dependencies:** Stages 1-7, Phase 8 (filtering, statistics)

**Estimated Effort:** High (3-5 days depending on ML integration)

---

### **Phase 11: ML/AI Pipeline Integration**

**Objective:** Prepare tokenized output for machine learning models and AI applications.

#### Sub-stages:

**11.1 - Token Stream Preprocessing**
- **File:** `src/utils/mlPreprocessing.ts`
- **Implementation:**
  - `prepareForModel(tokens, options)` with pipeline stages:
    - **Normalization:** Lowercase, remove accents, unicode normalization
    - **Filtering:** Remove stopwords, punctuation, whitespace
    - **Feature extraction:** Extract only "word" and "number" types
    - **Padding:** Add `<START>`, `<END>`, `<PAD>` special tokens
    - **Truncation:** Limit sequence length (e.g., max 512 tokens)
  - Return processed token stream ready for model input
- **Output Format Options:**
  - `tokens_only`: Array of token strings
  - `with_ids`: Include input_ids from vocab
  - `with_attention_mask`: Binary mask for padding
  - `with_type_ids`: Segment IDs for multi-sequence input (BERT-style)
- **Tests:** Verify preprocessing steps, padding/truncation logic
- **UI:** Add "Export for ML" button with format dropdown

**11.2 - Sequence-to-Sequence (Seq2Seq) Support**
- **File:** Extend `src/utils/mlPreprocessing.ts`
- **Implementation:**
  - `createSeq2SeqPairs(tokens, windowSize)` for next-token prediction:
    - Sliding window approach: `[token[0:n], token[n+1]]`
    - Generate training pairs: `(input_sequence, target_token)`
  - `createMaskedLanguageModel(tokens, maskProb)` for MLM tasks:
    - Randomly mask tokens with `<MASK>` token
    - Return `(masked_sequence, original_tokens, mask_positions)`
  - Export in JSONL format for model training:
    ```json
    {"input": ["hello", "world"], "target": "."}
    {"input": ["how", "are"], "target": "you"}
    ```
- **Tests:** Verify pair generation, masking probability, sequence lengths
- **UI:** Add "Generate Training Data" with task type selection (next-token, MLM, classification)

**11.3 - Type Pattern Analysis for Modeling**
- **File:** `src/utils/typePatterns.ts`
- **Implementation:**
  - `extractTypeSequences(tokens)` - create type-only sequences:
    - Example: `['word', 'whitespace', 'word', 'punctuation']`
  - `detectTypePatterns(tokens)` - find common patterns:
    - N-grams of types (bigrams, trigrams)
    - Sentence structure templates (e.g., "word-word-punctuation")
    - Anomaly detection (unusual type combinations)
  - `predictNextType(typeSequence, model)` - simple Markov chain predictor:
    - Build transition probability matrix from type sequences
    - Given partial sequence, predict next likely type
- **Training Data Generation:**
  - Export type sequences for training neural language models on structure
  - Useful for grammar checking, text generation constraints
- **Output:**
  ```json
  {
    "type_patterns": {
      "bigrams": { "word-punctuation": 42, "word-whitespace": 156 },
      "templates": ["word-word-punctuation", "word-whitespace-word"],
      "next_type_prediction": { "word": 0.7, "punctuation": 0.3 }
    }
  }
  ```
- **Tests:** Pattern extraction, n-gram counting, prediction accuracy
- **UI:** Show pattern analysis in statistics panel, visualize type transitions

**11.4 - Model Integration Helpers**
- **File:** `src/utils/modelIntegration.ts`
- **Implementation:**
  - **Hugging Face Transformers:**
    - `exportForHuggingFace(tokens)` - format for transformers library
    - Include `input_ids`, `attention_mask`, `token_type_ids`
    - Support batch processing
  - **OpenAI API:**
    - `exportForOpenAI(tokens)` - format as prompt with token metadata
    - Include system prompts for token-aware processing
  - **Custom Models:**
    - `exportToCSV(tokens)` - tabular format for traditional ML
    - `exportToTFRecord(tokens)` - TensorFlow format
    - `exportToPyTorch(tokens)` - PyTorch tensor format
  - Documentation on API authentication, rate limits, best practices
- **Tests:** Format validation, compatibility tests
- **UI:** "Export for..." dropdown with platform-specific options

**Dependencies:** Stages 1-7, Phase 8 (filtering), existing vocab encoder

**Estimated Effort:** High (4-6 days including testing and documentation)

---

### **Phase 12: Advanced Sentence Understanding**

**Objective:** Enhance sentence boundary detection with clause recognition and dependency parsing.

#### Sub-stages:

**12.1 - Clause Detection**
- Identify main clauses vs. subordinate clauses
- Detect coordinating conjunctions (and, but, or)
- Parse relative clauses (who, which, that)

**12.2 - Phrase Chunking**
- Noun phrases (NP): "the big red car"
- Verb phrases (VP): "has been running"
- Prepositional phrases (PP): "in the morning"

**12.3 - Dependency Parsing (Advanced)**
- Build dependency trees showing grammatical relationships
- Integrate lightweight parser (e.g., SpaCy.js, compromise)

**Dependencies:** Phase 10.1 (POS tagging)

**Estimated Effort:** Very High (5-7 days, requires NLP expertise)

---

### **Phase 13: Performance & Scalability**

**Objective:** Optimize for large documents and real-time processing.

#### Sub-stages:

**13.1 - Streaming Tokenization**
- Process large files in chunks (avoid loading entire file in memory)
- Implement web workers for background processing
- Progress indicators for long operations

**13.2 - Caching & Memoization**
- Cache tokenization results with content hash
- Memoize expensive operations (POS tagging, NER)
- IndexedDB for persistent caching

**13.3 - Batch Processing**
- Process multiple files in parallel
- Export batch results as ZIP archive
- Progress tracking UI

**Estimated Effort:** Medium-High (3-4 days)

---

### **Phase 14: API & Integration**

**Objective:** Expose tokenization capabilities via REST API and plugins.

#### Sub-stages:

**14.1 - REST API Server**
- Express/Fastify backend with `/tokenize` endpoint
- Authentication and rate limiting
- WebSocket support for real-time processing

**14.2 - Browser Extension**
- Chrome/Firefox extension for tokenizing web page text
- Context menu integration

**14.3 - VS Code Extension**
- Tokenize selected text in editor
- Inline token type annotations

**Estimated Effort:** High (5-7 days including deployment)

---

## Implementation Priority Recommendations

**High Priority (Immediate Value):**
1. Phase 8.1-8.2 (Filtering & Word Count) - Quick wins, commonly requested
2. Phase 9.1 (Token Visualization) - Improves UX significantly
3. Phase 10.3 (Sentiment Analysis) - High interest, moderate complexity

**Medium Priority (Enhance Capabilities):**
4. Phase 10.1-10.2 (POS & NER) - Foundation for advanced NLP
5. Phase 11.1-11.2 (ML Preprocessing) - Enables AI integration
6. Phase 13.1 (Streaming) - Needed for production use

**Low Priority (Specialized Use Cases):**
7. Phase 12 (Dependency Parsing) - Complex, niche applications
8. Phase 14 (API/Extensions) - Only after core features mature

---

## Technical Debt & Improvements

Before implementing future phases, address:
- **UTF-8 Encoding:** Fix apostrophe rendering (â€™ → ')
- **Character Offsets:** Add start/end positions to tokens
- **Regex Optimization:** Profile tokenization performance on large texts
- **Type System:** Consider migrating to branded types for stricter type safety
- **Error Handling:** Add try-catch blocks, user-friendly error messages
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support
- **Testing Coverage:** Aim for >90% code coverage
- **Documentation:** API docs with JSDoc comments, usage examples

---

## Resources & Dependencies

**Libraries to Consider:**
- **NLP:** `compromise`, `wink-nlp`, `natural`
- **Visualization:** `d3`, `recharts`, `visx`
- **ML:** `@tensorflow/tfjs`, `onnxruntime-web`
- **Testing:** `@testing-library/react`, `jest-extended`
- **Performance:** `web-worker`, `comlink`

**Data Sources:**
- **Stopwords:** NLTK stopwords list
- **POS Dictionaries:** Penn Treebank tags
- **Sentiment Lexicons:** AFINN, SentiWordNet
- **Entity Gazetteers:** DBpedia, Wikidata

**Learning Resources:**
- Stanford NLP Course (CS224N)
- "Speech and Language Processing" by Jurafsky & Martin
- Hugging Face NLP Course

---

*This roadmap is living documentation. Update as priorities shift and new requirements emerge.*
