import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Zap, Brain, Moon, Sun, X, ArrowRight } from 'lucide-react';

const DataMiningStudyGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedAlgo, setExpandedAlgo] = useState<string | null>(null);
  const [detailedAlgo, setDetailedAlgo] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [flippedCard, setFlippedCard] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const algorithms = {
    apriori: {
      name: "Apriori",
      type: "Breadth-First Search (BFS)",
      purpose: "Extract frequent itemsets using candidate generation",
      keyPoints: [
        "Uses level-wise search (breadth-first)",
        "Generates candidates then prunes non-frequent ones",
        "Based on anti-monotone property: if itemset is infrequent, all supersets are infrequent",
        "Multiple database scans (one per level)",
        "Uses lexicographic ordering to avoid redundancy"
      ],
      steps: [
        "Scan DB to count 1-itemsets → generate F₁",
        "Generate candidates Cₖ from Fₖ₋₁",
        "Prune candidates that don't have all subsets frequent",
        "Scan DB to count support of Cₖ",
        "Keep only frequent itemsets → Fₖ",
        "Repeat until no more candidates"
      ],
      optimization: [
        "Hash tree: makes support counting more efficient",
        "Reduces comparisons between transactions and candidates",
        "Lexicographic order: unique itemset representation (avoid redundancy)"
      ],
      complexity: "M × N operations per level (M candidates, N transactions) with brute force",
      example: "C₁={A:3, B:2, C:4} → F₁={A:3, C:4} (min_sup=3) → C₂={AC} → F₂={AC:2}",
      exercises: [
        {
          title: "Find Frequent Itemsets",
          description: "Database: {A,B,C}, {A,C}, {A,B,C,D}, {B,C}, {A,B,C}. min_sup=60%",
          solution: "STEP 1: Count transactions = 5, min_sup_count = 5×0.6 = 3\n\nSTEP 2: Scan database for items:\n• A appears in: T1,T3,T4,T5 = 4 times (≥3) ✓\n• B appears in: T1,T3,T5 = 3 times (≥3) ✓\n• C appears in: T1,T2,T3,T4,T5 = 5 times (≥3) ✓\n• D appears in: T3 = 1 time (<3) ✗\nResult: F₁={A:4, B:3, C:5}\n\nSTEP 3: Generate C₂ candidates: {AB}, {AC}, {BC}\n\nSTEP 4: Scan database for pairs:\n• AB: T1,T3,T5 = 3 times (≥3) ✓\n• AC: T1,T3,T4,T5 = 4 times (≥3) ✓\n• BC: T1,T3,T4,T5 = 4 times (≥3) ✓\nResult: F₂={AB:3, AC:4, BC:4}\n\nSTEP 5: Generate C₃: {ABC}\n\nSTEP 6: Scan database:\n• ABC: T1,T3,T5 = 3 times (≥3) ✓\nResult: F₃={ABC:3}\n\nFINAL FREQUENT ITEMSETS: {A}, {B}, {C}, {AB}, {AC}, {BC}, {ABC}"
        },
        {
          title: "Candidate Pruning",
          description: "Given F₂={AB, AC, BC}, generate C₃ and prune using Apriori property",
          solution: "STEP 1: Generate C₃ candidates by joining F₂:\nJoin AB + AC → ABC (share AB)\nJoin AB + BC → ABC (share B)\nJoin AC + BC → ABC (share C)\nResult: C₃={ABC}\n\nSTEP 2: Apply Apriori Pruning Property:\nFor ABC to be frequent, ALL 2-item subsets must be in F₂:\n• Check subset {AB}: YES, in F₂ ✓\n• Check subset {AC}: YES, in F₂ ✓\n• Check subset {BC}: YES, in F₂ ✓\n\nSTEP 3: Decision:\nAll subsets are frequent → KEEP ABC in C₃\nABC is a valid candidate for scanning\n\nSTEP 4: If any subset was missing from F₂:\nExample: If BC was NOT in F₂, then ABC would be pruned (not scanned)"
        },
        {
          title: "Algorithm Complexity",
          description: "Database with 1000 items, 100,000 transactions. Estimate Apriori passes needed.",
          solution: "GIVEN:\n• n = 1000 items\n• m = 100,000 transactions\n\nSTEP 1: Count rare items (support < 1%):\nAssuming 30% of items are frequent\nF₁ candidates ≈ 300 items\n\nSTEP 2: Generate F₂ candidates:\n|C₂| = 300 × 299 / 2 ≈ 45,000 candidates\nAfter pruning, |F₂| ≈ 150 itemsets (avg)\n\nSTEP 3: Generate F₃ candidates:\n|C₃| = combinations of F₂ ≈ 11,000 candidates\nAfter pruning, |F₃| ≈ 50 itemsets\n\nSTEP 4: Continue until no more frequent itemsets\nEstimated levels k ≈ 5-6\n\nSTEP 5: Total database scans = k = 5-6 passes\nTotal cost ≈ 5 × 100,000 = 500,000 transaction scans\n\nCONCLUSION: For this data, FP-Growth would be significantly faster (only 2 scans)"
        }
      ],
      commonMistakes: [
        "Forgetting to prune candidates - all k-1 subsets must be frequent",
        "Incorrect support counting - must scan entire database",
        "Generating too many candidates - use anti-monotone property",
        "Not checking min_support threshold correctly",
        "Confusing itemsets at different levels"
      ],
      studyChecklist: [
        "Understand anti-monotone property and its importance",
        "Know the 6 steps of Apriori algorithm",
        "Can trace through with real example",
        "Understand candidate generation and pruning",
        "Know complexity: O(M×N×k) where k=number of levels",
        "Can compare with FP-Growth efficiency"
      ]
    },
    
    fptree: {
      name: "FP-Growth (FP-Tree)",
      type: "Pattern Growth / Tree-based",
      purpose: "Extract frequent itemsets without candidate generation",
      keyPoints: [
        "Compresses database into FP-tree structure",
        "No candidate generation needed",
        "Only 2 database scans required",
        "Uses divide-and-conquer approach",
        "More efficient than Apriori for large databases"
      ],
      steps: [
        "First scan: count item frequencies",
        "Second scan: build FP-tree (items sorted by frequency)",
        "For each item (bottom-up in frequency): extract conditional pattern base",
        "Build conditional FP-tree",
        "Recursively mine conditional FP-trees"
      ],
      structure: "Root → branches with item:count nodes → header table links same items",
      advantage: "Minimizes database access, compresses transactions",
      example: "Transaction {A,B,D,E} with order [B:4, A:3, D:2] → path B:1→A:1→D:1",
      exercises: [
        {
          title: "Build FP-Tree",
          description: "Transactions: {A,B}, {A,C}, {A,B,C}, {A,B,D}, {C,D}. min_sup=2",
          solution: "STEP 1: First scan - count item frequencies:\n• A: appears in T1,T2,T3,T4 = 4 times\n• B: appears in T1,T3 = 2 times\n• C: appears in T2,T3,T5 = 3 times\n• D: appears in T4,T5 = 2 times\nAll items ≥ min_sup(2), so all frequent\n\nSTEP 2: Sort by frequency (descending): A(4), C(3), B(2), D(2)\n\nSTEP 3: Second scan - build FP-tree:\nT1:{A,B} → Root→A:1→B:1\nT2:{A,C} → Root→A:2→C:1\nT3:{A,B,C} → Root→A:3→B:2→C:1 OR Root→A:3→C:2\nT4:{A,B,D} → Root→A:4→B:3→D:1\nT5:{C,D} → Root→C:3→D:1\n\nSTEP 4: Final structure:\nRoot\n├─ A:4\n│  ├─ C:2\n│  │  └─ B:1\n│  └─ B:2\n│     └─ D:1\n└─ C:1\n   └─ D:1"
        },
        {
          title: "Extract Conditional Pattern Base",
          description: "From the FP-tree above, mine patterns for item D (min_sup=2)",
          solution: "STEP 1: Start with item D (leaf item by frequency)\n\nSTEP 2: Find all paths ending with D:\n• Path 1: Root→A:4→B:2→D:1 → prefix {A:1,B:1}\n• Path 2: Root→C:1→D:1 → prefix {C:1}\n\nSTEP 3: Construct conditional pattern base for D:\nCPB(D) = {(A,B):1, (C):1}\nThis means: D co-occurs with {A,B} in 1 transaction, with {C} in 1 transaction\n\nSTEP 4: Count frequencies in CPB:\n• A: 1 time (< min_sup of 2)\n• B: 1 time (< min_sup of 2)\n• C: 1 time (< min_sup of 2)\n\nSTEP 5: Result:\nNo frequent patterns from CPB(D)\nOnly single itemset D is frequent\n\nFINAL: Frequent patterns with D: {D}"
        }
      ]
    },
    
    eclat: {
      name: "Eclat",
      type: "Depth-First Search (DFS) / Vertical Data Format",
      purpose: "Extract frequent itemsets using transaction ID sets (tidsets)",
      keyPoints: [
        "Uses vertical database format (item → tidset)",
        "Depth-first search approach",
        "Support counting by tidset intersection",
        "No database scans after initial conversion",
        "More efficient memory usage than Apriori"
      ],
      steps: [
        "Convert horizontal DB to vertical format: item → {tid₁, tid₂, ...}",
        "For each itemset X: compute support by |tidset(X)|",
        "Generate new candidates by tidset intersection",
        "Use DFS to explore itemset lattice"
      ],
      advantage: "Fast support counting (just tidset size), no repeated DB scans",
      formula: "t(XᵢXⱼ) = t(Xᵢ) ∩ t(Xⱼ), support = |t(XᵢXⱼ)|",
      exercises: [
        {
          title: "Vertical Format Conversion",
          description: "Horizontal: T1:{A,B,C}, T2:{A,C}, T3:{B,C}. Convert to vertical",
          solution: "STEP 1: Create empty mapping for each item\n\nSTEP 2: Scan each transaction:\nT1:{A,B,C} → A:{1}, B:{1}, C:{1}\nT2:{A,C} → A:{1,2}, B:{1}, C:{1,2}\nT3:{B,C} → A:{1,2}, B:{1,3}, C:{1,2,3}\n\nSTEP 3: Final Vertical Format (Item → Tidset):\n• A: {1,2} (appears in T1,T2)\n• B: {1,3} (appears in T1,T3)\n• C: {1,2,3} (appears in T1,T2,T3)\n\nSupport values:\n• A: 2/3 = 66.7%\n• B: 2/3 = 66.7%\n• C: 3/3 = 100%"
        },
        {
          title: "Compute Tidset Intersections",
          description: "Find support of itemset {A,B} using tidsets from above",
          solution: "STEP 1: Recall tidsets:\n• t(A) = {1,2}\n• t(B) = {1,3}\n\nSTEP 2: Compute intersection:\nt(A,B) = t(A) ∩ t(B)\nt(A,B) = {1,2} ∩ {1,3}\nt(A,B) = {1}\n\nSTEP 3: Calculate support:\nsupport({A,B}) = |t(A,B)| / total_transactions\nsupport({A,B}) = 1/3 = 33.3%\n\nSTEP 4: Interpretation:\n{A,B} appears together ONLY in transaction T1\nThis is the power of vertical format - no DB scan needed!\n\nSTEP 5: If min_sup = 50%:\n33.3% < 50% → {A,B} is NOT frequent, PRUNE it"
        }
      ]
    },
    
    charm: {
      name: "CHARM",
      type: "Closed Itemset Mining",
      purpose: "Extract closed frequent itemsets (no superset with same support)",
      keyPoints: [
        "Extracts only closed itemsets (more compact)",
        "Uses tidset vertical format like Eclat",
        "Orders itemsets by increasing support (optimization)",
        "An itemset X is closed if c(X) = X (closure operator)",
        "4 properties based on tidset relationships"
      ],
      properties: [
        "If t(Xᵢ) = t(Xⱼ): replace Xᵢ and Xⱼ by XᵢXⱼ",
        "If t(Xᵢ) ⊂ t(Xⱼ): replace Xᵢ by XᵢXⱼ",
        "If t(Xᵢ) ⊃ t(Xⱼ): replace Xⱼ by XᵢXⱼ",
        "If t(Xᵢ) ≠ t(Xⱼ): add both XᵢXⱼ to candidates"
      ],
      closureOperator: "c(X) = i(t(X)) where i = items in all transactions, t = tidset",
      ordering: "Increasing support avoids testing both t(Xᵢ) ⊂ t(Xⱼ) and t(Xⱼ) ⊂ t(Xᵢ)",
      exercises: [
        {
          title: "Identify Closed Itemsets",
          description: "Transactions: T1:{A,B,C}, T2:{A,B,C}, T3:{A,B}, T4:{A,D}. min_sup=50%. Find closed itemsets.",
          solution: "STEP 1: Find all frequent itemsets (min_sup = 2 transactions):\nF₁: {A}:4, {B}:3, {C}:2, {D}:1 ✗\nF₂: {A,B}:3, {A,C}:2, {B,C}:2, {A,D}:1 ✗\nF₃: {A,B,C}:2\n\nSTEP 2: Check if each frequent itemset is closed:\n\n{A}: closure c({A}) = items in all transactions where A appears\nA appears in T1,T2,T3,T4. Common items: {A} only\nc({A}) = {A} → CLOSED ✓\n\n{B}: B appears in T1,T2,T3. Common items: {A,B}\nc({B}) = {A,B} ≠ {B} → NOT CLOSED ✗\n\n{C}: C appears in T1,T2. Common items: {A,B,C}\nc({C}) = {A,B,C} ≠ {C} → NOT CLOSED ✗\n\n{A,B}: AB appears in T1,T2,T3. Common items: {A,B}\nc({A,B}) = {A,B} → CLOSED ✓\n\n{A,C}: AC appears in T1,T2. Common items: {A,B,C}\nc({A,C}) = {A,B,C} ≠ {A,C} → NOT CLOSED ✗\n\n{B,C}: BC appears in T1,T2. Common items: {A,B,C}\nc({B,C}) = {A,B,C} ≠ {B,C} → NOT CLOSED ✗\n\n{A,B,C}: ABC appears in T1,T2. Common items: {A,B,C}\nc({A,B,C}) = {A,B,C} → CLOSED ✓\n\nSTEP 3: CLOSED ITEMSETS = {{A}, {A,B}, {A,B,C}}\nNote: These 3 itemsets represent ALL frequent itemsets perfectly!"
        },
        {
          title: "CHARM Property Application",
          description: "Compare tidsets t(A)={1,2,3,4}, t(B)={1,2,3}, t(AB)=? Which property applies?",
          solution: "STEP 1: Recall CHARM properties:\nP1: If t(Xᵢ) = t(Xⱼ) → replace both with XᵢXⱼ\nP2: If t(Xᵢ) ⊂ t(Xⱼ) → replace Xᵢ with XᵢXⱼ\nP3: If t(Xᵢ) ⊃ t(Xⱼ) → replace Xⱼ with XᵢXⱼ\nP4: If t(Xᵢ) ≠ t(Xⱼ) (incomparable) → test both\n\nSTEP 2: Compare tidsets:\nt(A) = {1,2,3,4} (size 4)\nt(B) = {1,2,3} (size 3)\nt(A) ≠ t(B)\nt(A) ⊃ t(B) (A's tidset is SUPERSET of B's)\n\nSTEP 3: Which property?\nt(A) ⊃ t(B) → Property P3 applies!\nP3 says: Replace B with AB\nMeaning: Whenever we see {B}:3, we can combine with {A} to get {A,B}\n\nSTEP 4: Optimization benefit:\nWe don't need to explore B separately\nWe explore AB directly instead\nThis reduces the search space!\n\nSTEP 5: Compute t(A,B):\nt(A,B) = t(A) ∩ t(B) = {1,2,3,4} ∩ {1,2,3} = {1,2,3}\nNote: t(A,B) = t(B), so {A,B} has same support as {B}"
        }
      ]
    },
    
    genmax: {
      name: "GenMax",
      type: "Maximal Itemset Mining",
      purpose: "Extract maximal frequent itemsets (no frequent superset)",
      keyPoints: [
        "Maximal itemset: frequent itemset with no frequent superset",
        "More compact than all frequent itemsets",
        "Uses backtracking search",
        "Maintains list of maximal itemsets found",
        "Progressive intersection technique"
      ],
      definition: "X is maximal if X is frequent and ∀Y ⊃ X, Y is not frequent",
      advantage: "Smallest representation of all frequent itemsets (but loses support info)",
      relationship: "Closed ⊇ Maximal (all maximal are closed, not all closed are maximal)"
    },
    
    gsp: {
      name: "GSP (Generalized Sequential Patterns)",
      type: "Sequential Pattern Mining",
      purpose: "Extract frequent sequences from sequential databases",
      keyPoints: [
        "Similar to Apriori but for sequences",
        "A sequence is ordered list of itemsets: <(AB)(C)(D)>",
        "Subsequence: maintain order, can skip elements",
        "Candidate generation and pruning like Apriori",
        "Multiple passes over database"
      ],
      steps: [
        "Find frequent 1-sequences → L₁",
        "Generate candidate k-sequences from Lₖ₋₁",
        "Prune candidates (all k-1 subsequences must be frequent)",
        "Count support by checking which sequences contain candidate",
        "Repeat until no candidates"
      ],
      example: "S=<CAGAAGT> contains subsequence <AAG> (support++)",
      support: "Number of sequences that contain the pattern as subsequence"
    },
    
    prefixspan: {
      name: "PrefixSpan",
      type: "Sequential Pattern Mining / Pattern Growth",
      purpose: "Mine sequential patterns using prefix-projected databases without candidate generation",
      keyPoints: [
        "Pattern growth approach (like FP-Growth for sequences)",
        "No candidate generation needed",
        "Uses prefix projection to build projected databases",
        "More efficient than GSP for large datasets",
        "Divide-and-conquer strategy"
      ],
      steps: [
        "Find frequent 1-sequences (length-1 prefixes)",
        "For each prefix: build projected database",
        "Recursively mine projected databases",
        "Grow patterns by appending items"
      ],
      advantage: "No candidate generation, reduced search space",
      example: "Sequences: <A B C>, <A C D>, <B C>. Find sequences: <A>, <B>, <C> (1-seqs), then <AC>, <BC> (2-seqs)",
      exercises: [
        {
          title: "Build Projected Database",
          description: "Sequences: <A B>, <A C>, <B C>, <A B C>. Build projected database for prefix <A>",
          solution: "Projected DB for <A>: <B>, <C>, <B C>. These are suffixes after <A>"
        },
        {
          title: "Find Sequential Patterns",
          description: "From above, find all frequent patterns with min_sup=2",
          solution: "<A>:4, <B>:3, <C>:4, <A,B>:2, <A,C>:2, <B,C>:2"
        }
      ],
      commonMistakes: [
        "Forgetting that order matters in sequences (unlike itemsets)",
        "Confusing itemsets {A,B} with sequences <A B> (different support)",
        "Not building projected databases correctly - must maintain order",
        "Missing candidate patterns in recursive mining"
      ],
      studyChecklist: [
        "Understand prefix projection concept",
        "Know how to build projected databases",
        "Can trace through algorithm with example",
        "Understand why no candidate generation needed",
        "Can compare with GSP efficiency"
      ]
    }
  };

  const flashcards = [
    {
      question: "What is the anti-monotone property?",
      answer: "If an itemset is infrequent, all its supersets are also infrequent. This allows pruning in Apriori."
    },
    {
      question: "Apriori vs FP-Growth: key difference?",
      answer: "Apriori generates candidates (multiple DB scans), FP-Growth uses tree structure (2 scans only)"
    },
    {
      question: "What is a closed itemset?",
      answer: "An itemset X where c(X) = X, meaning no superset has the same support"
    },
    {
      question: "What is a maximal itemset?",
      answer: "A frequent itemset with no frequent superset. All maximal itemsets are closed."
    },
    {
      question: "Horizontal vs Vertical data format?",
      answer: "Horizontal: TID → items. Vertical: Item → TIDset. Eclat/CHARM use vertical."
    },
    {
      question: "Why order itemsets by increasing support in CHARM?",
      answer: "To avoid testing both t(Xᵢ) ⊂ t(Xⱼ) AND t(Xⱼ) ⊂ t(Xᵢ) - property 2 only needs one direction"
    },
    {
      question: "How many itemsets from k items?",
      answer: "2^k total (including empty set), 2^k - 1 excluding empty set"
    },
    {
      question: "GSP vs PrefixSpan?",
      answer: "GSP: candidate generation (like Apriori). PrefixSpan: pattern growth, no candidates"
    },
    {
      question: "What is a sequence vs itemset?",
      answer: "Sequence: ordered <(AB)(C)(D)>, Itemset: unordered {A,B,C}"
    },
    {
      question: "Hash tree in Apriori: purpose?",
      answer: "Makes support counting more efficient, reduces comparisons between transactions and candidates"
    },
    {
      question: "Confidence formula?",
      answer: "conf(X→Y) = support(X∪Y) / support(X) = P(Y|X)"
    },
    {
      question: "When is a rule misleading?",
      answer: "When conf(X→Y) = P(Y), meaning X and Y are independent (or conf < P(Y), negative correlation)"
    },
    {
      question: "Derivable itemset?",
      answer: "An itemset whose support can be exactly calculated from its subsets using bounds (LB = UB)"
    },
    {
      question: "BFS vs DFS in frequent mining?",
      answer: "BFS: Apriori, GSP (level-wise). DFS: Eclat, FP-Growth (depth-first)"
    },
    {
      question: "Lexicographic ordering advantage?",
      answer: "Unique itemset representation, avoids redundant candidate generation (AB = BA)"
    }
  ];

  const keyFormulas = [
    {
      name: "Support",
      formula: "support(X) = |transactions containing X| / |total transactions|",
      use: "Measure frequency of itemset"
    },
    {
      name: "Confidence",
      formula: "conf(X→Y) = support(X∪Y) / support(X)",
      use: "Strength of association rule"
    },
    {
      name: "Lift",
      formula: "lift(X→Y) = support(X∪Y) / (support(X) × support(Y))",
      use: "Detect independence: lift=1 means independent, >1 positive correlation, <1 negative"
    },
    {
      name: "Closure Operator",
      formula: "c(X) = i(t(X)) where t(X)=tidset of X, i(T)=items common to all transactions in T",
      use: "Test if itemset is closed: X is closed iff c(X) = X"
    },
    {
      name: "Lower Bound (derivable)",
      formula: "sup(X) ≥ Σ(-1)^|W| × sup(W) for all W ⊆ X, |X\\Y| even",
      use: "Minimum possible support"
    },
    {
      name: "Upper Bound (derivable)",
      formula: "sup(X) ≤ Σ(-1)^|W| × sup(W) for all W ⊆ X, |X\\Y| odd",
      use: "Maximum possible support"
    },
    {
      name: "Number of k-itemsets",
      formula: "C(n,k) = n! / (k! × (n-k)!)",
      use: "Count maximum possible k-itemsets from n items"
    },
    {
      name: "Rules from k-itemset",
      formula: "2^k - 2 rules",
      use: "Each k-itemset (k>1) can generate this many association rules"
    }
  ];

  const examTips = [
    "Always check if an itemset is closed: c(X) = X?",
    "Maximal itemsets: no frequent superset exists",
    "For CHARM: order by increasing support (avoid double checking)",
    "Apriori pruning: if any subset is not frequent, prune the candidate",
    "For sequences: check if pattern maintains ORDER (can skip elements)",
    "Confidence alone can be misleading - check if conf(X→Y) > P(Y)",
    "FP-tree: 2 scans only (1st: count frequencies, 2nd: build tree)",
    "Derivable: when lower bound = upper bound, support is exactly known",
    "Vertical format (Eclat/CHARM): Item → {TID list}",
    "When calculating contingency tables, check independence: P(Y|X) = P(Y)?",
    "GSP generates candidates, PrefixSpan uses pattern growth",
    "Hash tree reduces M×N to N operations in Apriori",
    "Lexicographic order: ensures unique itemset representation"
  ];

  const toggleAlgo = (key: string) => {
    setExpandedAlgo(expandedAlgo === key ? null : key);
  };

  const nextCard = () => {
    setFlippedCard(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlippedCard(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } p-6`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold mb-2 ${
              darkMode ? 'text-blue-300' : 'text-indigo-900'
            }`}>Data Mining Study Guide</h1>
            <p className={darkMode ? 'text-slate-400' : 'text-indigo-600'}>Master 2 MID - Complete Algorithm Reference</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-colors ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                : 'bg-white hover:bg-indigo-50 text-indigo-600'
            } shadow-lg`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </header>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {['overview', 'algorithms', 'flashcards', 'formulas', 'tips'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeSection === section
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-white'
                  : darkMode
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Detailed Algorithm View */}
        {detailedAlgo && (
          <div className={`fixed inset-0 z-50 overflow-y-auto ${
            darkMode ? 'bg-slate-900 bg-opacity-75' : 'bg-black bg-opacity-50'
          }`}>
            <div className="min-h-screen flex items-start justify-center p-4 pt-8">
              <div className={`w-full max-w-4xl rounded-2xl shadow-2xl ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
                {/* Close Button */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
                  <h1 className={`text-3xl font-bold ${darkMode ? 'text-cyan-300' : 'text-indigo-900'}`}>
                    {(algorithms[detailedAlgo as keyof typeof algorithms] as any)?.name}
                  </h1>
                  <button
                    onClick={() => setDetailedAlgo(null)}
                    className={`p-2 rounded-lg transition ${
                      darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {detailedAlgo && (() => {
                    const algo = algorithms[detailedAlgo as keyof typeof algorithms] as any;
                    return (
                      <>
                  {/* Type and Purpose */}
                  <div className={`p-4 rounded-lg border-l-4 ${
                    darkMode ? 'bg-cyan-900 bg-opacity-30 border-cyan-500' : 'bg-cyan-50 border-cyan-500'
                  }`}>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {algo?.type}
                    </p>
                    <p className={`mt-2 text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {algo?.purpose}
                    </p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      📚 Key Points
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {algo?.keyPoints?.map((point: string, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                          darkMode ? 'bg-blue-900 bg-opacity-30 border-blue-500' : 'bg-blue-50 border-blue-500'
                        }`}>
                          <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  {algo?.steps && (
                    <div>
                      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-green-300' : 'text-green-900'}`}>
                        ⚙️ Algorithm Steps
                      </h2>
                      <div className="space-y-3">
                        {(algo?.steps || []).map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              darkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800'
                            }`}>
                              {idx + 1}
                            </div>
                            <p className={`pt-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exercises */}
                  {algo?.exercises && (
                    <div>
                      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                        ✏️ Practice Exercises
                      </h2>
                      <div className="space-y-4">
                        {(algo?.exercises || []).map((exercise: any, idx: number) => (
                          <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                            darkMode ? 'bg-orange-900 bg-opacity-30 border-orange-500' : 'bg-orange-50 border-orange-500'
                          }`}>
                            <h3 className={`font-bold mb-2 ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                              Exercise {idx + 1}: {exercise.title}
                            </h3>
                            <p className={`mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              <strong>Problem:</strong> {exercise.description}
                            </p>
                            <details className="cursor-pointer">
                              <summary className={`font-semibold flex items-center gap-2 ${
                                darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-700 hover:text-orange-800'
                              }`}>
                                <ArrowRight className="w-4 h-4" /> Show Solution
                              </summary>
                              <div className={`mt-3 p-3 rounded-lg whitespace-pre-line font-mono text-sm leading-relaxed ${
                                darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-gray-700'
                              }`}>
                                {exercise.solution}
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {algo?.example && (
                    <div className={`p-4 rounded-lg border-l-4 font-mono text-sm ${
                      darkMode ? 'bg-violet-900 bg-opacity-30 border-violet-500 text-violet-200' : 'bg-violet-50 border-violet-500 text-violet-900'
                    }`}>
                      <strong className={`block mb-2 ${darkMode ? 'text-violet-300' : 'text-violet-900'}`}>📋 Example:</strong>
                      <p className="break-words">{algo?.example}</p>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {algo?.commonMistakes && (
                    <div>
                      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-red-300' : 'text-red-900'}`}>
                        ⚠️ Common Mistakes to Avoid
                      </h2>
                      <div className="space-y-3">
                        {(algo?.commonMistakes || []).map((mistake: string, idx: number) => (
                          <div key={idx} className={`p-3 rounded-lg border-l-4 flex gap-3 ${
                            darkMode ? 'bg-red-900 bg-opacity-30 border-red-500' : 'bg-red-50 border-red-500'
                          }`}>
                            <span className={`text-xl flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>✗</span>
                            <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{mistake}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Study Checklist */}
                  {algo?.studyChecklist && (
                    <div>
                      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        ✅ Study Checklist
                      </h2>
                      <div className="space-y-2">
                        {(algo?.studyChecklist || []).map((item: string, idx: number) => (
                          <label key={idx} className="flex items-start gap-3 cursor-pointer p-2 hover:rounded hover:bg-opacity-20 hover:bg-blue-500 transition">
                            <input
                              type="checkbox"
                              className="w-5 h-5 mt-1 rounded"
                              defaultChecked={false}
                            />
                            <span className={`${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                      </>
                    );
                  })()}
                </div>

                {/* Close Footer */}
                <div className={`p-4 border-t ${darkMode ? 'border-slate-700 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}>
                  <button
                    onClick={() => setDetailedAlgo(null)}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      darkMode
                        ? 'bg-slate-600 hover:bg-slate-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className={`rounded-xl shadow-lg p-6 ${
            darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              darkMode ? 'text-blue-300' : 'text-indigo-900'
            }`}>
              <BookOpen className="w-6 h-6" /> Course Overview
            </h2>
            
            <div className="space-y-4">
              <div className={`border-l-4 pl-4 ${
                darkMode
                  ? 'border-blue-500 bg-slate-700 bg-opacity-50 p-4 rounded-r-lg'
                  : 'border-indigo-500'
              }`}>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-blue-300' : ''}`}>Frequent Pattern Mining</h3>
                <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Finding patterns (itemsets) that appear frequently in transactional databases</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'
                }`}>
                  <h4 className={`font-bold mb-2 ${
                    darkMode ? 'text-blue-300' : 'text-indigo-800'
                  }`}>Itemset Mining</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <li>• Apriori (BFS, candidate generation)</li>
                    <li>• FP-Growth (pattern growth, tree-based)</li>
                    <li>• Eclat (DFS, vertical format)</li>
                    <li>• CHARM (closed itemsets)</li>
                    <li>• GenMax (maximal itemsets)</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-50'
                }`}>
                  <h4 className={`font-bold mb-2 ${
                    darkMode ? 'text-purple-300' : 'text-indigo-800'
                  }`}>Sequential Mining</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <li>• GSP (Apriori-like for sequences)</li>
                    <li>• PrefixSpan (pattern growth)</li>
                    <li>• Sequences maintain ORDER</li>
                    <li>• Example: {"<(AB)(C)(D)>"}</li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 rounded-lg mt-4 ${
                darkMode ? 'bg-amber-900 bg-opacity-30' : 'bg-amber-50'
              }`}>
                <h4 className={`font-bold mb-2 ${
                  darkMode ? 'text-amber-300' : 'text-amber-800'
                }`}>Key Concepts</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <strong className={darkMode ? 'text-amber-200' : ''}>Support:</strong> <span className={darkMode ? 'text-slate-300' : ''}>Frequency of pattern</span>
                  </div>
                  <div>
                    <strong className={darkMode ? 'text-amber-200' : ''}>Confidence:</strong> <span className={darkMode ? 'text-slate-300' : ''}>Rule strength</span>
                  </div>
                  <div>
                    <strong className={darkMode ? 'text-amber-200' : ''}>Closed:</strong> <span className={darkMode ? 'text-slate-300' : ''}>No superset with same support</span>
                  </div>
                  <div>
                    <strong className={darkMode ? 'text-amber-200' : ''}>Maximal:</strong> <span className={darkMode ? 'text-slate-300' : ''}>No frequent superset</span>
                  </div>
                  <div>
                    <strong className={darkMode ? 'text-amber-200' : ''}>Derivable:</strong> <span className={darkMode ? 'text-slate-300' : ''}>Support calculable from subsets</span>
                  </div>
                  <div>
                    <strong className={darkMode ? 'text-amber-200' : ''}>Anti-monotone:</strong> <span className={darkMode ? 'text-slate-300' : ''}>Subset property for pruning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'algorithms' && (
          <div className="space-y-4">
            {Object.entries(algorithms).map(([key, algo]) => (
              <div key={key} className={`rounded-xl shadow-lg overflow-hidden border transition-all ${
                darkMode ? 'bg-slate-800 border-slate-700 hover:border-cyan-600' : 'bg-white border-gray-200 hover:border-cyan-400'
              }`}>
                <button
                  onClick={() => toggleAlgo(key)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-white transition font-semibold ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700'
                  }`}
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold">{algo.name}</h3>
                    <p className="text-sm opacity-90">{algo.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedAlgo === key ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>

                {expandedAlgo === key && (
                  <div className={`p-6 space-y-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    <button
                      onClick={() => setDetailedAlgo(key)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 mb-2 ${
                        darkMode
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                      }`}
                    >
                      📖 Learn in Detail with Exercises <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className={`p-4 rounded-lg border-l-4 ${
                      darkMode ? 'bg-cyan-900 bg-opacity-30 border-cyan-500' : 'bg-cyan-50 border-cyan-500'
                    }`}>
                      <strong className={darkMode ? 'text-cyan-300' : 'text-cyan-900'}>📌 Purpose:</strong>
                      <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{algo.purpose}</p>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 ${
                      darkMode ? 'bg-blue-900 bg-opacity-30 border-blue-500' : 'bg-blue-50 border-blue-500'
                    }`}>
                      <h4 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        <span>✨</span> Key Points
                      </h4>
                      <ul className="space-y-2">
                        {algo.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className={`mt-1 text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>▹</span>
                            <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(algo as any).steps && (
                      <div className={`p-4 rounded-lg border-l-4 ${
                        darkMode ? 'bg-green-900 bg-opacity-30 border-green-500' : 'bg-green-50 border-green-500'
                      }`}>
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-green-300' : 'text-green-900'}`}>
                          <span>⚙️</span> Algorithm Steps
                        </h4>
                        <ol className="space-y-2">
                          {((algo as any).steps || []).map((step: string, idx: number) => (
                            <li key={idx} className="flex gap-3">
                              <span className={`font-bold px-2 py-1 rounded text-sm ${darkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800'}`}>{idx + 1}</span>
                              <span className={`pt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {(algo as any).properties && (
                      <div>
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                          <span>🔗</span> CHARM Properties
                        </h4>
                        <div className="space-y-2">
                          {((algo as any).properties || []).map((prop: string, idx: number) => (
                            <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                              darkMode ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' : 'bg-indigo-50 border-indigo-500'
                            }`}>
                              <strong className={darkMode ? 'text-indigo-300' : 'text-indigo-800'}>Property {idx + 1}:</strong>
                              <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{prop}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(algo as any).optimization && (
                      <div className={`p-4 rounded-lg border-l-4 ${
                        darkMode ? 'bg-orange-900 bg-opacity-30 border-orange-500' : 'bg-orange-50 border-orange-500'
                      }`}>
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                          <span>⚡</span> Optimizations
                        </h4>
                        <ul className="space-y-2">
                          {((algo as any).optimization || []).map((opt: string, idx: number) => (
                            <li key={idx} className={`flex gap-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>→</span>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(algo as any).advantage && (
                      <div className={`p-4 rounded-lg border-l-4 ${
                        darkMode ? 'bg-emerald-900 bg-opacity-30 border-emerald-500' : 'bg-emerald-50 border-emerald-500'
                      }`}>
                        <strong className={`flex items-center gap-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>
                          <span>🎯</span> Advantage
                        </strong>
                        <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{(algo as any).advantage}</p>
                      </div>
                    )}

                    {(algo as any).example && (
                      <div className={`p-4 rounded-lg border-l-4 font-mono text-sm ${
                        darkMode ? 'bg-violet-900 bg-opacity-30 border-violet-500 text-violet-200' : 'bg-violet-50 border-violet-500 text-violet-900'
                      }`}>
                        <strong className={`block mb-2 ${darkMode ? 'text-violet-300' : 'text-violet-900'}`}>📋 Example:</strong>
                        <p className="break-words">{(algo as any).example}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'flashcards' && (
          <div className={`rounded-2xl shadow-2xl p-8 ${
            darkMode ? 'bg-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}>
            {/* Header */}
            <div className="mb-8">
              <h2 className={`text-3xl font-bold mb-2 text-center flex items-center justify-center gap-2 ${
                darkMode ? 'text-cyan-300' : 'text-indigo-900'
              }`}>
                <Brain className="w-8 h-8" /> Study Cards
              </h2>
              <div className={`text-center text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Master the concepts with spaced repetition
              </div>

              {/* Progress Bar */}
              <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                ></div>
              </div>
              <div className={`text-center text-xs mt-2 font-semibold ${darkMode ? 'text-cyan-300' : 'text-indigo-700'}`}>
                Card {currentCard + 1} of {flashcards.length}
              </div>
            </div>

            {/* Main Card */}
            <div 
              onClick={() => setFlippedCard(!flippedCard)}
              className={`rounded-2xl p-10 min-h-96 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:shadow-2xl mb-8 border-2 ${
                darkMode
                  ? `bg-gradient-to-br from-slate-700 to-slate-600 border-cyan-500 hover:border-cyan-400 ${flippedCard ? 'ring-2 ring-green-500' : 'ring-2 ring-cyan-500'}`
                  : `bg-gradient-to-br from-white to-blue-50 border-indigo-300 hover:border-indigo-400 ${flippedCard ? 'ring-2 ring-green-400' : 'ring-2 ring-indigo-400'}`
              }`}
            >
              {/* Card Content */}
              <div className="text-center flex-1 flex flex-col justify-center w-full">
                <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                  flippedCard
                    ? darkMode ? 'text-green-300' : 'text-green-700'
                    : darkMode ? 'text-cyan-300' : 'text-indigo-700'
                }`}>
                  {flippedCard ? '✓ ANSWER' : '❓ QUESTION'}
                </div>
                <p className={`text-3xl md:text-4xl font-bold leading-relaxed ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {flippedCard ? flashcards[currentCard].answer : flashcards[currentCard].question}
                </p>
              </div>

              {/* Click to Flip Hint */}
              <div className={`text-xs mt-4 opacity-70 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Click card to {flippedCard ? 'see question' : 'reveal answer'} • Space to flip
              </div>
            </div>

            {/* Study Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={prevCard}
                className={`py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                    : 'bg-white hover:bg-gray-100 text-indigo-700 border border-indigo-300'
                }`}
              >
                ← Previous
              </button>

              <button
                onClick={() => setFlippedCard(!flippedCard)}
                className={`py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white'
                }`}
              >
                🔄 Flip
              </button>

              <button
                onClick={nextCard}
                className={`py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                    : 'bg-white hover:bg-gray-100 text-indigo-700 border border-indigo-300'
                }`}
              >
                Next →
              </button>
            </div>

            {/* Study Tips */}
            <div className={`rounded-lg p-4 text-sm ${
              darkMode ? 'bg-slate-700 border border-slate-600' : 'bg-blue-100 border border-indigo-200'
            }`}>
              <p className={`font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-indigo-800'}`}>💡 Study Tips:</p>
              <ul className={`space-y-1 text-xs ${darkMode ? 'text-slate-300' : 'text-indigo-900'}`}>
                <li>• Read the question carefully first</li>
                <li>• Try to answer from memory before flipping</li>
                <li>• Understand concepts, don't just memorize</li>
                <li>• Revisit difficult cards regularly</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'formulas' && (
          <div className={`rounded-xl shadow-lg p-6 ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-blue-300' : 'text-indigo-900'
            }`}>Essential Formulas</h2>
            <div className="space-y-4">
              {keyFormulas.map((formula, idx) => (
                <div key={idx} className={`border-l-4 p-4 rounded-r-lg ${
                  darkMode
                    ? 'border-blue-500 bg-slate-700 bg-opacity-50'
                    : 'border-indigo-500 bg-indigo-50'
                }`}>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-indigo-900'}`}>{formula.name}</h3>
                  <div className={`p-3 rounded font-mono text-sm mb-2 ${
                    darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white'
                  }`}>
                    {formula.formula}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}><strong>Use:</strong> {formula.use}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'tips' && (
          <div className={`rounded-xl shadow-lg p-6 ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? 'text-blue-300' : 'text-indigo-900'
            }`}>
              <Zap className="w-6 h-6" /> Exam Tips & Tricks
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {examTips.map((tip, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
                  darkMode
                    ? 'border-green-600 bg-green-900 bg-opacity-30'
                    : 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                }`}>
                  <span className={`font-bold text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{idx + 1}</span>
                  <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{tip}</span>
                </div>
              ))}
            </div>

            <div className={`mt-6 border-l-4 p-4 rounded-r-lg ${
              darkMode
                ? 'border-amber-600 bg-amber-900 bg-opacity-30'
                : 'border-amber-500 bg-amber-50'
            }`}>
              <h3 className={`font-bold mb-2 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>Common Exam Question Types:</h3>
              <ul className={`space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>✓ Extract frequent itemsets (Apriori, FP-Growth)</li>
                <li>✓ Extract closed/maximal itemsets (CHARM, GenMax)</li>
                <li>✓ Sequential pattern mining (GSP steps)</li>
                <li>✓ Calculate confidence, support, lift</li>
                <li>✓ Contingency tables and independence testing</li>
                <li>✓ Derivable itemsets (bounds calculation)</li>
                <li>✓ FP-tree construction and conditional FP-trees</li>
                <li>✓ Test if itemset is closed using c(X) = X</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataMiningStudyGuide;