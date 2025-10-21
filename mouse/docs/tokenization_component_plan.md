# Tokenization Component Planning Document

## Goals
- Allow users to input text via file upload (text documents) or by typing/pasting into a text field
- Tokenize the input text into meaningful units (words, sentences, or custom tokens)
- Display a summary or feedback to the user about the tokenization result
- Prepare the output format for further processing by another component

## Requirements
### Functional
- UI for uploading `.txt` or `.md` files
- UI for entering or pasting text manually
- Tokenization logic (basic: whitespace, punctuation, or customizable)
- Display token count and a preview of tokens
- Output format suitable for downstream processing (e.g., array of tokens, JSON)
- Feedback to user (summary: number of tokens, sample tokens, etc.)

### Non-Functional
- Responsive and accessible UI
- Efficient handling of large text files
- Modular design for easy extension (e.g., support for more file types or tokenization strategies)

## Architecture
- **TokenizationComponent**: Handles user input (file/text), tokenization, and output display
- **App**: Hosts the TokenizationComponent and manages global state if needed
- **Tokenization Logic**: Utility functions for splitting text into tokens
- **Output/Feedback**: UI section for summary and preview

### Component Structure
```
App
└── TokenizationComponent
    ├── FileUpload (subcomponent or section)
    ├── TextInput (subcomponent or section)
    ├── Tokenization logic (utility)
    └── OutputSummary (subcomponent or section)
```

## Suggested Output Format
- **Array of tokens**: `["token1", "token2", ...]`
- **JSON object**: `{ "tokens": ["token1", "token2", ...], "count": 123 }`
- **Summary string**: "123 tokens found. Sample: token1, token2, ..."

## User Feedback
- Number of tokens
- Sample of first N tokens
- Optionally, warnings for empty input or very large files

## Progress Log

### Phase 1: Scaffold TokenizationComponent (In Progress)
- [x] Created TokenizationComponent with file upload and text input UI
- [x] Integrated TokenizationComponent into App
- [ ] Confirm UI/UX meets requirements

### Phase 2: Implement Tokenization Logic (In Progress)
- [x] Added a utility function to tokenize input text (by whitespace/punctuation)
- [x] Connected tokenization logic to the UI (token count and sample tokens shown)
- [ ] Confirm output and feedback meets requirements

### Phase 3: Display Output Summary (In Progress)
- [x] Enhanced output summary: shows token count, sample tokens, output JSON, and warnings for empty/large input
- [ ] Confirm summary and feedback meets requirements

### Phase 4: Prepare Output for Downstream (In Progress)
- [x] Output is formatted as array/JSON
- [x] Added button to download output as JSON file for downstream processing
- [ ] Confirm output format and download meets requirements

### Phase 5: Finalize, Summarize, Suggest Tests (In Progress)
- [x] All planned features implemented and confirmed working
- [x] UI feedback and output download confirmed
- [x] Button contrast improved for accessibility
- [ ] Review and finalize documentation
- [ ] Suggest tests to confirm functionality

## Expansion Plan: Advanced Tokenization

### Goals
- Support tokenization by punctuation, whitespace, and special characters using regular expressions
- Allow configuration of tokenization rules (e.g., split by specific characters)
- Optionally assign a type to each token (e.g., word, punctuation, whitespace, special)

### Requirements
- Extend tokenization utility to use configurable regex patterns
- UI option to select or preview tokenization mode
- Output tokens with type information (if enabled)
- Unit tests to confirm correct identification of words, punctuation, whitespace, and special characters

### Architecture
- **TokenizationComponent**: Add UI for selecting tokenization mode
- **Tokenization Logic**: Refactor to support regex-based splitting and token typing
- **Token Type**: Define a type/interface for tokens (e.g., `{ value: string, type: 'word' | 'punctuation' | 'whitespace' | 'special' }`)

### Suggested Unit Test
- Input: "Hello, world! 123"
- Expect tokens: [ { value: "Hello", type: "word" }, { value: ",", type: "punctuation" }, { value: " ", type: "whitespace" }, { value: "world", type: "word" }, { value: "!", type: "punctuation" }, { value: " ", type: "whitespace" }, { value: "123", type: "word" } ]

### Stages
1. Refactor tokenization utility for regex and token types (Completed)
   - [x] Tokenization logic now uses regex and assigns types to tokens
   - [x] Token type interface defined
   - [x] Sample tokens in UI show value and type
   - [ ] Confirm output meets requirements
2. Add UI for selecting tokenization mode (Completed)
   - [x] UI controls added to select between basic (whitespace) and advanced (regex/types) tokenization
   - [x] Tokenization logic updates based on selected mode
   - [ ] Confirm UI and logic meet requirements
3. Implement and run unit tests for advanced tokenization (Completed)
   - [x] Unit tests written for words, numbers, punctuation, whitespace, and special characters
   - [x] All tests pass, confirming correct token identification
4. Summarize completed work in planning doc (In Progress)
   - [x] All planned features for advanced tokenization are implemented and tested
   - [x] UI allows mode selection and displays token types
   - [x] Output and tests confirm robust functionality
   - [ ] Ready for further design, integration, or extension

## Next Steps
1. Display summary and sample tokens
2. Prepare output for downstream processing

## Suggested Tests

1. **Manual UI Tests**
   - Upload a .txt file and verify tokens are displayed and counted correctly
   - Type/paste text and verify tokens are displayed and counted correctly
   - Download JSON and verify file contents match displayed output
   - Check for warning on large input and empty input feedback
   - Confirm button is visible and accessible

2. **Unit Tests (for tokenize utility)**
   - Tokenize simple sentence: expect correct array of tokens
   - Tokenize empty string: expect empty array
   - Tokenize string with punctuation: expect correct splitting
   - Tokenize large input: expect performance within reasonable bounds

3. **Accessibility/UX**
   - Tab navigation and screen reader labels for all controls
   - Sufficient color contrast for all UI elements

## Summary
- TokenizationComponent allows file upload or text input
- Tokenization logic is modular and tested
- Output summary and download are user-friendly
- Planning doc and progress log are up to date
- Ready for further design, extension, or integration

- Token types now include: word, number, punctuation, whitespace, special
- Numbers are treated as a distinct token type for more precise analysis
- Whitespace tokens are retained for structure and formatting

## Input IDs (token -> id) Expansion

### What are input_ids?
- input_ids are numeric identifiers assigned to tokens. They're commonly used by language models (transformers) as the model's input.
- Each unique token maps to an integer in a vocabulary (vocab). For example: {"Hello": 101, ",": 12, "world": 102}

### Why include them?
- Makes the tokenization output directly usable by ML models and encoding pipelines
- Enables deterministic encoding/decoding and compact storage
- Facilitates interoperability with libraries and model runtimes that expect token ids

### Design options
1. Simple vocab-based encoder (fast to implement)
   - Build a vocabulary from input or a predefined list
   - Map each token.value to an integer (assign new ids for unseen tokens)
   - Pros: simple, transparent; Cons: OOV (out-of-vocab) handling needed

2. Pretrained/subword tokenizers (recommended for production)
   - Use libraries like Hugging Face Tokenizers or tiktoken for byte-pair/subword tokenization
   - Pros: matches model tokenization, efficient; Cons: external dependency and integration complexity

3. Hybrid approach
   - Start with simple vocab + optional plugin to swap in a pretrained tokenizer later

### Token id format
- Output JSON can include input_ids: [101, 12, 102, ...]
- Keep both tokens and input_ids in the output for traceability: { tokens: [...], input_ids: [...], token_map: [{value,type,id}] }

### Token types and ids
- Token types remain the same (word, number, punctuation, whitespace, special)
- ids map to token values, not types (multiple tokens of same value share same id)

### OOV handling
- Reserve a special id for unknown tokens (e.g. 0 for <UNK>)
- Optionally allow dynamic vocab expansion with persistent storage

### Suggested unit test
- Build a small vocab: {Hello: 1, ',': 2, ' ': 3, world:4}
- Input: "Hello, world"
- Expect input_ids: [1,2,3,4]

### Implementation stages
1. Implement a small, in-repo vocab encoder with encode/decode helpers and tests
2. Add UI option to include input_ids in exported JSON
3. Add tests for OOV, decoding, and round-trip
4. (Optional) Integrate pretrained tokenizer (Hugging Face/tiktoken) and map its ids into the output format

### Next steps
- I'll implement Stage 1 (simple vocab encoder + tests) if you want — it will be fast and keeps the project self-contained.
- Otherwise we can skip to integrating a pretrained tokenizer.

### Stage 5: Input IDs Implementation (In Progress)
- [x] Added an in-repo `Vocab` encoder with dynamic vocab and encode/decode helpers (`src/utils/vocab.ts`)
- [x] UI toggle to include `input_ids` in output and download added to `TokenizationComponent`
- [x] Unit tests for the vocab encoder added and passing
- [ ] Add round-trip and OOV unit tests
