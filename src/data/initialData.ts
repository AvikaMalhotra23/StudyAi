import { StudentUser, LearningModule, StoreItem, Doubt, StoreOrder, AIConceptExtraction } from '../types';

export const INITIAL_USERS: StudentUser[] = [
  {
    id: 'user_aarav',
    name: 'Aarav Sharma',
    email: 'aarav.jee@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    school: 'DPS R.K. Puram, Delhi',
    student_class: 'Class 12',
    target_exam: 'JEE Advanced 2027',
    stream: 'PCM',
    stars: 520,
    streak_days: 16,
    last_login_date: '2026-09-17',
    last_spin_date: '2026-09-16',
    login_history: ['2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'],
    modules_completed: 22,
    doubts_solved: 28,
    upvotes_received: 74,
    quiz_accuracy_pct: 95.5,
    rating_score: 96,
    bio: 'Targeting IIT Bombay CSE (AIR < 200). Strong in Mechanics, Calculus, and Chemical Kinetics. Always open for problem-solving!'
  },
  {
    id: 'user_ananya',
    name: 'Ananya Verma',
    email: 'ananya.neet@student.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    school: 'Kendriya Vidyalaya IIT Powai',
    student_class: 'Class 11',
    target_exam: 'NEET-UG 2027',
    stream: 'PCB',
    stars: 380,
    streak_days: 11,
    last_login_date: '2026-09-17',
    last_spin_date: '2026-09-17',
    login_history: ['2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'],
    modules_completed: 16,
    doubts_solved: 19,
    upvotes_received: 52,
    quiz_accuracy_pct: 91.0,
    rating_score: 92,
    bio: 'Targeting AIIMS New Delhi. Mastering NCERT Line-by-Line for Biology and Organic Reactions. Looking for daily quiz revision buddies!'
  },
  {
    id: 'user_rohit',
    name: 'Rohit Kumar',
    email: 'rohit.cbse@student.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    school: 'DAV Public School, Chandigarh',
    student_class: 'Class 12',
    target_exam: 'CBSE 12th + JEE Mains',
    stream: 'PCM',
    stars: 260,
    streak_days: 6,
    last_login_date: '2026-09-16',
    last_spin_date: '2026-09-15',
    login_history: ['2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16'],
    modules_completed: 11,
    doubts_solved: 10,
    upvotes_received: 26,
    quiz_accuracy_pct: 84.5,
    rating_score: 83,
    bio: 'Focusing on 95%+ in CBSE 12th Board exams and scoring 99+ percentile in JEE Mains. Practicing NCERT derivations and sample papers.'
  },
  {
    id: 'user_meera',
    name: 'Meera Iyer',
    email: 'meera.foundation@student.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    school: 'National Public School, Bengaluru',
    student_class: 'Class 10',
    target_exam: 'CBSE Board 10th (Foundation)',
    stream: 'Foundation',
    stars: 440,
    streak_days: 14,
    last_login_date: '2026-09-17',
    last_spin_date: '2026-09-16',
    login_history: ['2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'],
    modules_completed: 18,
    doubts_solved: 22,
    upvotes_received: 60,
    quiz_accuracy_pct: 94.0,
    rating_score: 95,
    bio: 'Class 10 NTSE Scholar & Olympiad aspirant. Loves Physics (Optics, Electricity) and Trigonometry proofs. Active doubt solver!'
  }
];

export const INITIAL_MODULES: LearningModule[] = [
  {
    id: 'mod_phy_rot',
    title: 'Rotational Dynamics & Moment of Inertia',
    subject: 'Physics',
    grade_level: 'Class 11/12 (JEE & NEET)',
    difficulty: 'JEE Mains & NEET',
    duration_mins: 45,
    star_reward: 60,
    description: 'Master torque, angular momentum conservation, parallel/perpendicular axis theorems, and rolling without slipping dynamics.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
    quiz_data: [
      {
        q: 'A solid sphere and a hollow sphere of equal mass and radius roll down an inclined plane without slipping. Which reaches the bottom first?',
        options: ['Hollow sphere', 'Solid sphere', 'Both reach together', 'Depends on incline angle'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'What is the Moment of Inertia of a uniform solid cylinder of mass M and radius R about its longitudinal central axis?',
        options: ['MR^2', '1/2 MR^2', '2/5 MR^2', '1/12 MR^2'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'When a spinning ice skater pulls her arms inward, which quantity remains strictly conserved?',
        options: ['Rotational Kinetic Energy', 'Angular Momentum', 'Linear Velocity', 'Moment of Inertia'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  },
  {
    id: 'mod_chem_org',
    title: 'Aldehydes, Ketones & Nucleophilic Additions',
    subject: 'Chemistry',
    grade_level: 'Class 12 (CBSE & JEE)',
    difficulty: 'CBSE Board Core & JEE',
    duration_mins: 40,
    star_reward: 55,
    description: "NCERT-focused mechanisms: Cannizzaro reaction, Aldol condensation, Clemmensen reduction, and Tollens' test distinguishing aldehydes.",
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
    quiz_data: [
      {
        q: "Which of the following compounds gives a positive Tollens' silver mirror test?",
        options: ['Acetone', 'Benzaldehyde', 'Acetophenone', 'Ethanol'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'What reagent is specifically used in the Clemmensen Reduction of carbonyl compounds?',
        options: ['Zn-Hg in concentrated HCl', 'NH2-NH2 in KOH', 'LiAlH4 in ether', 'Pd/BaSO4 with H2'],
        ans: 0,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'Which aldehyde lacks alpha-hydrogens and thus undergoes the Cannizzaro reaction in 50% conc. NaOH?',
        options: ['Acetaldehyde', 'Formaldehyde (HCHO)', 'Propionaldehyde', 'Butanal'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  },
  {
    id: 'mod_math_calc',
    title: "Definite Integrals & King's Property Shortcuts",
    subject: 'Mathematics',
    grade_level: 'Class 12 (JEE & Boards)',
    difficulty: 'JEE Advanced & Boards',
    duration_mins: 50,
    star_reward: 70,
    description: "Learn lightning-fast shortcuts for symmetry integrals, King's Property [∫ f(x) = ∫ f(a+b-x)], and Leibniz rule for differentiation under integral sign.",
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
    quiz_data: [
      {
        q: "What is the value of ∫[0 to π/2] (sin^3(x) / (sin^3(x) + cos^3(x))) dx using King's Property?",
        options: ['π/2', 'π/4', '1', '0'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'If f(x) is an odd continuous function on [-a, a], what is the value of ∫[-a to a] f(x) dx?',
        options: ['2a', '2 ∫[0 to a] f(x) dx', '0', 'a^2'],
        ans: 2,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'What is the derivative with respect to x of ∫[0 to x^2] cos(t) dt according to the Leibniz Integral Rule?',
        options: ['cos(x^2)', '2x * cos(x^2)', '-sin(x^2)', '2x * sin(x^2)'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  },
  {
    id: 'mod_bio_gen',
    title: 'Molecular Basis of Inheritance (DNA & Operon)',
    subject: 'Biology',
    grade_level: 'Class 12 (NEET & CBSE)',
    difficulty: 'NEET High-Yield & NCERT',
    duration_mins: 45,
    star_reward: 65,
    description: 'Master Meselson-Stahl experiment, DNA semi-conservative replication fork, genetic code degeneracy, and Lac Operon regulatory genetics.',
    thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600',
    quiz_data: [
      {
        q: 'Which isotope pair was utilized by Meselson and Stahl to prove semi-conservative replication in E. coli?',
        options: ['14N and 15N', '32P and 35S', '12C and 14C', '3H and 14N'],
        ans: 0,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'In the Lac Operon, which gene encodes the Permease enzyme that facilitates lactose entry?',
        options: ['lac Z', 'lac Y', 'lac A', 'lac I'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'Which property of genetic codons states that a single amino acid can be specified by more than one triplet codon?',
        options: ['Unambiguous', 'Degeneracy', 'Universal', 'Non-overlapping'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      }
    ]
  },
  {
    id: 'mod_fnd_optics',
    title: 'Light: Reflection, Refraction & Lens Formula',
    subject: 'Class 10 Foundation',
    grade_level: 'Class 10 (CBSE Board)',
    difficulty: 'CBSE Board 10th',
    duration_mins: 35,
    star_reward: 45,
    description: 'Foundation optics: Cartesian sign conventions, mirror formula, refractive index, lens power in diopters, and ray diagram constructions.',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600',
    quiz_data: [
      {
        q: 'A convex lens has a focal length of +20 cm. What is its optical power in Diopters (D)?',
        options: ['+2 D', '+5 D', '-5 D', '+0.2 D'],
        ans: 1,
        difficulty: 'Foundation',
        stars_bonus: 1
      },
      {
        q: 'Where should an object be placed in front of a concave mirror to obtain a real image of the same size as the object?',
        options: ['At the Focus (F)', 'At the Center of Curvature (C)', 'Between F and C', 'Beyond C'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'What is the relation between focal length (f) and radius of curvature (R) for a spherical mirror of small aperture?',
        options: ['f = 2R', 'f = R / 2', 'f = R^2', 'f = 1/R'],
        ans: 1,
        difficulty: 'Foundation',
        stars_bonus: 1
      }
    ]
  },
  {
    id: 'mod_py_basics',
    title: 'Python 3 Programming: Syntax, Loops & Data Structures',
    subject: 'Coding & Tech Skills',
    grade_level: 'Class 11/12 (CBSE CS & Beginners)',
    difficulty: 'CBSE Computer Science & Tech Skills',
    duration_mins: 35,
    star_reward: 60,
    description: 'Learn core Python syntax: variables, data structures (lists, tuples, dicts), for/while loops, functions with default arguments, and file handling required in CBSE CS curricula.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
    code_playground: {
      language: 'python',
      default_code: `# Calculate factorial and Fibonacci sequence in Python 3
def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

def fibonacci_series(terms):
    seq = [0, 1]
    while len(seq) < terms:
        seq.append(seq[-1] + seq[-2])
    return seq

number = 5
print(f"Factorial of {number}: {calculate_factorial(number)}")
print(f"First 7 Fibonacci numbers: {fibonacci_series(7)}")`,
      expected_output: `Factorial of 5: 120
First 7 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8]`,
      hints: [
        'Functions are defined using the def keyword followed by colon :',
        'Indentation (4 spaces) defines execution blocks instead of curly braces',
        'Lists in Python are dynamic, zero-indexed and mutable'
      ],
      explanation: 'Python utilizes readable dynamic typing, automatic memory garbage collection, and rich standard libraries making it the ideal first programming language.'
    },
    quiz_data: [
      {
        q: 'What is the output of the following Python list comprehension: [x**2 for x in range(4)]?',
        options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 2, 4, 6]', '[1, 2, 3, 4]'],
        ans: 0,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'Which of the following built-in Python data structures is strictly immutable?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        ans: 3,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'What sequence of numbers does range(2, 10, 3) generate in Python 3?',
        options: ['2, 5, 8', '2, 3, 4, 5, 6, 7, 8, 9', '2, 4, 6, 8, 10', '3, 6, 9'],
        ans: 0,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  },
  {
    id: 'mod_cpp_dsa',
    title: 'C++ Foundations & Algorithmic Problem Solving',
    subject: 'Coding & Tech Skills',
    grade_level: 'Class 11/12 & Engineering Aspirants',
    difficulty: 'Competitive Programming & DSA',
    duration_mins: 45,
    star_reward: 75,
    description: 'Master C++ fast I/O, Standard Template Library (std::vector, std::sort, std::pair), pointers vs references, and Big-O computational time complexity analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    code_playground: {
      language: 'cpp',
      default_code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> scores = {92, 78, 98, 85, 90};
    
    // Sort scores in ascending order using C++ STL
    std::sort(scores.begin(), scores.end());
    
    std::cout << "Sorted Scores: ";
    for (int s : scores) {
        std::cout << s << " ";
    }
    std::cout << "\\nHighest Score: " << scores.back() << std::endl;
    return 0;
}`,
      expected_output: `Sorted Scores: 78 85 90 92 98 
Highest Score: 98`,
      hints: [
        'std::vector provides dynamic arrays that automatically manage memory',
        'std::sort uses introsort with O(N log N) guaranteed worst-case time complexity',
        'scores.back() retrieves a reference to the last element in constant O(1) time'
      ],
      explanation: 'C++ provides direct memory addressing via pointers, deterministic destruction, and lightning execution speeds, making it the industry standard for competitive programming.'
    },
    quiz_data: [
      {
        q: 'What is the worst-case time complexity of Binary Search in a sorted C++ array or vector?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'What does the operator *ptr perform in C++ when ptr is a declared pointer variable?',
        options: ['Multiplication with ptr', 'Dereferencing the pointer to access the stored value', 'Allocating new heap memory', 'Returning the memory address of ptr'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'Which C++ STL container provides O(1) average time complexity for key lookups using a hash table?',
        options: ['std::vector', 'std::list', 'std::unordered_map', 'std::set'],
        ans: 2,
        difficulty: 'Intermediate',
        stars_bonus: 3
      }
    ]
  },
  {
    id: 'mod_java_oop',
    title: 'Java Basics & Object-Oriented Programming (OOP)',
    subject: 'Coding & Tech Skills',
    grade_level: 'Class 10/11/12 (ICSE & CBSE CS)',
    difficulty: 'OOP & Software Architecture',
    duration_mins: 40,
    star_reward: 65,
    description: 'Explore core OOP principles: Classes & Objects, Encapsulation with private fields, Inheritance with extends, Polymorphism (overloading vs overriding), and Constructors.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    code_playground: {
      language: 'java',
      default_code: `// Java OOP demonstration: Student Class with Encapsulation
class Student {
    private String name;
    private int stars;

    public Student(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }

    public void addStars(int bonus) {
        this.stars += bonus;
    }

    public void displayStats() {
        System.out.println("Student: " + this.name + " | Total Stars: " + this.stars);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Aarav", 420);
        s1.addStars(80);
        s1.displayStats();
    }
}`,
      expected_output: `Student: Aarav | Total Stars: 500`,
      hints: [
        'private fields encapsulate data and prevent direct external modification',
        'this keyword refers to the current instance of the class',
        'Constructors initialize object state upon instantiation with new'
      ],
      explanation: 'Java is an object-oriented, strictly typed language compiled into bytecode executed on any platform with a Java Virtual Machine (JVM).'
    },
    quiz_data: [
      {
        q: 'Which keyword in Java is used to inherit properties and methods from a parent class?',
        options: ['implements', 'inherits', 'extends', 'super'],
        ans: 2,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'What happens when a method is declared with the static modifier in Java?',
        options: ['It cannot be accessed outside its package', 'It belongs to the class itself rather than a specific object instance', 'It can only return boolean values', 'It must be overridden in child classes'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'Which of the following is NOT one of the four foundational pillars of Object-Oriented Programming (OOP)?',
        options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'],
        ans: 2,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  },
  {
    id: 'mod_web_js',
    title: 'Web Development & Modern JavaScript (ES6+)',
    subject: 'Coding & Tech Skills',
    grade_level: 'Class 9-12 Skill Elective & Practical Projects',
    difficulty: 'Interactive Web Programming',
    duration_mins: 35,
    star_reward: 55,
    description: 'Learn how interactive web applications work: HTML5 DOM elements, ES6 arrow functions, array transformations (.map, .filter, .reduce), and asynchronous event handling.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
    code_playground: {
      language: 'javascript',
      default_code: `// Filter high-scoring students and transform into awards list
const students = [
  { name: 'Aarav', score: 96, target: 'JEE' },
  { name: 'Ananya', score: 94, target: 'NEET' },
  { name: 'Rohit', score: 82, target: 'CBSE' },
  { name: 'Meera', score: 91, target: 'Foundation' }
];

const topPerformers = students
  .filter(s => s.score >= 90)
  .map(s => \`\${s.name} (\${s.target}): Gold Medal 🏅\`);

console.log("Top Performers (> 90%):");
topPerformers.forEach(item => console.log(\`• \${item}\`));`,
      expected_output: `Top Performers (> 90%):
• Aarav (JEE): Gold Medal 🏅
• Ananya (NEET): Gold Medal 🏅
• Meera (Foundation): Gold Medal 🏅`,
      hints: [
        '.filter() creates a shallow copy of array elements meeting the boolean predicate',
        '.map() creates a new array populated with the results of calling the provided function on every element',
        'Template literals use backticks ` and ${expression} interpolation'
      ],
      explanation: 'JavaScript powers dynamic behavior across all modern web browsers, enabling responsive user interfaces, animations, and real-time network requests.'
    },
    quiz_data: [
      {
        q: 'In JavaScript, what is the primary difference between double equals (==) and triple equals (===)?',
        options: ['== converts types before comparison; === compares both value and type strictly', '=== only works with numbers', '== is for objects; === is for primitive strings', 'There is no difference in modern ECMAScript'],
        ans: 0,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'What does the JavaScript Array method .filter() return?',
        options: ['The first matching element', 'A boolean true or false', 'A new array containing all elements that pass the predicate test', 'The array length'],
        ans: 2,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'Which keyword declares a block-scoped variable that cannot be reassigned in JavaScript?',
        options: ['var', 'let', 'const', 'static'],
        ans: 2,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  }
];

export const INITIAL_STORE_ITEMS: StoreItem[] = [
  {
    id: 'item_omr_book',
    name: 'Official OMR Mock Answer Sheet Book (100 Sheets)',
    category: 'Exam Essentials',
    star_cost: 80,
    stock: 70,
    description: 'Realistic NEET/JEE format 100-page OMR answer sheet practice pad with bubble alignment and timer margin for timed test simulation.',
    image_url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400',
    badge: 'Top Pick for JEE/NEET'
  },
  {
    id: 'item_formula_chart',
    name: 'Laminated Master Formula Wall Chart (PCM + PCB)',
    category: 'Study Aids',
    star_cost: 110,
    stock: 50,
    description: 'High-gloss waterproof laminated 24x36 inch wall chart containing all NCERT Class 11 & 12 Physics, Chemistry & Maths essential formulas.',
    image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    badge: 'Must-Have'
  },
  {
    id: 'item_book_stand',
    name: 'Ergonomic Wooden Book & Tablet Stand',
    category: 'Desk Stationary',
    star_cost: 140,
    stock: 45,
    description: 'Adjustable multi-angle bamboo desktop holder. Holds heavy HC Verma, DC Pandey, NCERT textbooks, or tablets hands-free for neck comfort.',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    badge: 'Bestseller'
  },
  {
    id: 'item_hoodie',
    name: "EduQuest 'Target AIR < 100' Motivation Cotton Tee",
    category: 'Apparel',
    star_cost: 240,
    stock: 35,
    description: 'Premium breathable combed cotton student t-shirt with inspirational exam mission typography. Available in S, M, L, XL.',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400',
    badge: 'Official Merch'
  },
  {
    id: 'item_pen_pack',
    name: 'NCERT Pastel Highlighter & 0.5mm Fineliner Set',
    category: 'Desk Stationary',
    star_cost: 60,
    stock: 90,
    description: 'Pack of 6 quick-dry pastel dual-tip highlighters + 4 black bleed-proof archival fine-liner pens for neat margin notes and flowcharts.',
    image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
    badge: 'Essential'
  },
  {
    id: 'item_timer',
    name: 'JEE / NEET Digital Countdown Stopwatch & Desk Timer',
    category: 'Exam Essentials',
    star_cost: 160,
    stock: 40,
    description: 'Multi-mode silent vibrating exam timer with 3-hour mock countdown, lap tracker, and magnetic back for study desk.',
    image_url: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400',
    badge: 'Popular'
  },
  {
    id: 'item_bio_cards',
    name: 'High-Yield NEET Biology Diagram Flashcards Deck',
    category: 'Study Aids',
    star_cost: 125,
    stock: 45,
    description: 'Set of 120 color-coded laminated flashcards covering all NCERT diagrams: Human Physiology, Genetics, Plant Anatomy, and Cell Division.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    badge: 'NEET Favorite'
  },
  {
    id: 'item_geometry_kit',
    name: 'CBSE Board Exam Compass & Geometry Drafting Kit',
    category: 'Desk Stationary',
    star_cost: 75,
    stock: 80,
    description: 'Shatter-resistant transparent ruler, protractor, precision self-centering metal compass, and stencil kit approved for CBSE exam centers.',
    image_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400',
    badge: 'Board Exam Ready'
  }
];

export const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'ORD-JEE-101',
    user_id: 'user_aarav',
    item_id: 'item_omr_book',
    item_name: 'Official OMR Mock Answer Sheet Book (100 Sheets)',
    star_cost: 80,
    recipient_name: 'Aarav Sharma',
    shipping_address: 'Flat 402, Greenfield Apts, Sector 14',
    city: 'New Delhi',
    pincode: '110078',
    status: 'Delivered',
    ordered_at: '2026-09-15 11:20:00'
  }
];

export const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'dbt_1',
    author_id: 'user_ananya',
    author_name: 'Ananya Verma',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    author_class: 'Class 11',
    author_exam: 'NEET-UG 2027',
    author_rating: 92,
    title: 'How does Allolactose act as an inducer in the Lac Operon? (NEET PYQ)',
    description: "NCERT mentions that lactose enters the cell and is converted to allolactose, which binds to the repressor. Why doesn't the repressor permanently bind to the operator in the presence of allolactose? Please explain the conformational change.",
    subject: 'Biology',
    difficulty: 'Tough',
    bounty_stars: 35,
    created_at: '2026-09-17 14:30',
    status: 'solved',
    upvotes: 7,
    accepted_answer_id: 'ans_1',
    answers: [
      {
        id: 'ans_1',
        doubt_id: 'dbt_1',
        author_id: 'user_aarav',
        author_name: 'Aarav Sharma',
        author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        author_class: 'Class 12',
        author_rating: 96,
        content: `Here is the exact NCERT concept for NEET:
1. **Beta-galactosidase** in basal amounts converts a fraction of lactose into **allolactose**.
2. Allolactose binds to the allosteric site of the **lac repressor protein** (encoded by the *i* gene).
3. This causes a **conformational change** in the DNA-binding domain of the repressor, reducing its affinity for the **operator (o)** region.
4. RNA Polymerase can now freely bind to the **promoter (p)** and transcribe *lac Z, Y, and A*. Hence allolactose acts as the true physiological inducer!`,
        created_at: '2026-09-17 14:45',
        upvotes: 14,
        is_accepted: true
      }
    ]
  },
  {
    id: 'dbt_2',
    author_id: 'user_aarav',
    author_name: 'Aarav Sharma',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    author_class: 'Class 12',
    author_exam: 'JEE Advanced 2027',
    author_rating: 96,
    title: 'Condition for pure rolling of a cylinder on an accelerating truck bed',
    description: "If a uniform cylinder of mass m rests on a flat truck bed accelerating with acceleration 'a', what is the minimum friction coefficient μ required so that the cylinder rolls without slipping? I keep getting 1/3 a/g vs 1/2 a/g.",
    subject: 'Physics',
    difficulty: 'Tough',
    bounty_stars: 40,
    created_at: '2026-09-17 15:10',
    status: 'open',
    upvotes: 9,
    answers: []
  },
  {
    id: 'dbt_3',
    author_id: 'user_rohit',
    author_name: 'Rohit Kumar',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    author_class: 'Class 12',
    author_exam: 'CBSE 12th + JEE Mains',
    author_rating: 83,
    title: 'CBSE Board Step-Marking: Homogeneous Differential Equation substitution',
    description: "In CBSE 12th Board marking scheme, how many marks are allocated to verifying homogeneity vs substituting y = vx and separating variables? Do we lose marks if we don't explicitly state f(λx, λy) = λ^0 f(x, y)?",
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    bounty_stars: 25,
    created_at: '2026-09-17 16:00',
    status: 'open',
    upvotes: 4,
    answers: []
  }
];

export const PRESET_EXTRACTIONS: Record<string, AIConceptExtraction> = {
  induction: {
    title: 'NCERT Class 12 Physics: Electromagnetic Induction & Lenz’s Law',
    summary: [
      "Faraday's Law of Induction: Induced electromotive force (emf) ε = -dΦB/dt is directly proportional to the time rate of change of magnetic flux through the closed circuit.",
      "Lenz's Law: The polarity of the induced emf always opposes the change in magnetic flux that causes it (direct manifestation of the Law of Conservation of Energy).",
      "Motional EMF: A straight conducting rod of length L moving with velocity v perpendicular to uniform magnetic field B produces ε = B · v · L.",
      "Self-Inductance & Stored Energy: Flux linkage Φ = L · I; the magnetic potential energy stored in an inductor is U = 1/2 L · I^2. Crucial for JEE Mains & CBSE derivations."
    ],
    flashcards: [
      {
        front: "State Lenz's Law and its governing conservation principle.",
        back: "The direction of induced current always opposes the magnetic flux change causing it. It is an immediate consequence of the Law of Conservation of Energy."
      },
      {
        front: "What is the formula for Motional EMF in a rotating rod of length L at angular velocity ω in uniform B?",
        back: "ε = 1/2 · B · ω · L^2 (Derived by integrating v = ω·r from r = 0 to L)."
      },
      {
        front: "What are Eddy Currents and how are they minimized in transformer cores?",
        back: "Circulating currents induced in bulk metallic conductors. Minimized by utilizing laminated soft-iron sheets insulated by varnish."
      },
      {
        front: "What is the mutual inductance M between two concentric coplanar circular coils (radii r1 << r2)?",
        back: "M = (μ0 · π · r1^2) / (2 · r2). Frequently tested in JEE Advanced and CBSE 12th Board papers."
      }
    ],
    quiz: [
      {
        q: 'A copper ring is held horizontally and a bar magnet is dropped vertically through its axis. The acceleration of the falling magnet is:',
        options: ['Equal to g at all times', 'Less than g while entering and leaving the ring', 'Greater than g', 'Zero'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'The SI unit of magnetic flux ΦB is Weber (Wb). In terms of Tesla (T) and meters (m), 1 Wb equals:',
        options: ['1 T / m^2', '1 T · m^2', '1 T · m', '1 T · s'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'In an inductor of inductance 2 Henry carrying a steady current of 3 Amperes, the stored magnetic energy is:',
        options: ['6 Joules', '9 Joules', '18 Joules', '3 Joules'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      }
    ]
  },
  genetics: {
    title: 'NEET Biology: Molecular Basis of Inheritance (DNA & Operon)',
    summary: [
      "NCERT High-Yield: DNA is a double-stranded antiparallel polynucleotide helix with helical pitch 3.4 nm and 10 base pairs per complete turn (Watson & Crick).",
      "Meselson & Stahl Experiment (1958): Confirmed semi-conservative DNA replication in E. coli using heavy 15N and normal 14N CsCl density gradient centrifugation.",
      "Replication Fork: Leading strand synthesized continuously (5' to 3'); Lagging strand synthesized discontinuously as Okazaki fragments joined by DNA Ligase.",
      "Lac Operon: Negative inducible system. Inducer (allolactose) binds the repressor protein, freeing the operator (o) for RNA polymerase transcription."
    ],
    flashcards: [
      {
        front: "Which enzyme performs both polymerisation and proofreading during prokaryotic DNA replication?",
        back: "DNA Polymerase III (5' to 3' polymerase activity with 3' to 5' exonuclease proofreading)."
      },
      {
        front: "What is the chemical difference between Ribose and Deoxyribose sugar?",
        back: "Deoxyribose lacks an oxygen atom at the 2' carbon position (has -H instead of -OH), imparting greater chemical stability to DNA."
      },
      {
        front: "What is the universal start codon in translation and which amino acid does it code for in eukaryotes?",
        back: "AUG; it codes for Methionine (Met) and acts as the universal translation initiator."
      },
      {
        front: "In the Lac Operon, what specific role is performed by the lac Y gene product?",
        back: "Encodes Permease, which increases cell membrane permeability to beta-galactosides (lactose)."
      }
    ],
    quiz: [
      {
        q: 'During DNA replication, Okazaki fragments on the lagging template strand are covalently joined together by:',
        options: ['DNA Polymerase I', 'DNA Ligase', 'Topoisomerase / Gyrase', 'RNA Helicase'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: "According to Chargaff's rules for double-stranded B-DNA, which ratio is always constant and equal to 1?",
        options: ['(A + T) / (G + C)', '(A + G) / (T + C)', 'A / C', 'T / G'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'Which step in the Central Dogma of molecular biology is catalyzed by Reverse Transcriptase in retroviruses?',
        options: ['DNA to RNA', 'RNA to DNA', 'RNA to Protein', 'Protein to RNA'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  },
  integrals: {
    title: "JEE Mathematics: Definite Integrals & King's Rule",
    summary: [
      "King's Property: ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx. Used to eliminate complex trigonometric and logarithmic expressions.",
      "Symmetry Integrals: If f(-x) = -f(x) (odd), ∫[-a to a] f(x) dx = 0. If f(-x) = f(x) (even), ∫[-a to a] f(x) dx = 2 ∫[0 to a] f(x) dx.",
      "Leibniz Integral Rule: d/dx [∫[u(x) to v(x)] f(t) dt] = f(v(x)) · v'(x) - f(u(x)) · u'(x). Essential for JEE Advanced limit & derivative questions.",
      "Periodic Definite Integrals: If f(x + T) = f(x), then ∫[0 to nT] f(x) dx = n ∫[0 to T] f(x) dx."
    ],
    flashcards: [
      {
        front: "State King's Property and when to apply it in definite integrals.",
        back: "∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx. Apply whenever adding the modified integral cancels out the numerator or yields a constant sum."
      },
      {
        front: "What is the standard value of ∫[0 to π/2] ln(sin x) dx?",
        back: "- (π / 2) · ln(2). A classic JEE Mains / Advanced result frequently used as a stepping stone in larger problems."
      },
      {
        front: "How do you evaluate limit of a Riemann sum as a definite integral?",
        back: "Replace r/n with x, 1/n with dx, and lim (n->∞) Σ with ∫ from lower limit (r_min/n) to upper limit (r_max/n)."
      },
      {
        front: "State the Leibniz differentiation rule for ∫[g(x) to h(x)] f(t) dt.",
        back: "f(h(x)) · h'(x) - f(g(x)) · g'(x)."
      }
    ],
    quiz: [
      {
        q: "What is the value of ∫[0 to π/2] (sin^3 x / (sin^3 x + cos^3 x)) dx?",
        options: ['π/2', 'π/4', '1', '0'],
        ans: 1,
        difficulty: 'Intermediate',
        stars_bonus: 3
      },
      {
        q: 'If f(x) is an odd continuous function on [-a, a], what is the value of ∫[-a to a] f(x) dx?',
        options: ['2a', '2 ∫[0 to a] f(x) dx', '0', 'a^2'],
        ans: 2,
        difficulty: 'Tough',
        stars_bonus: 5
      },
      {
        q: 'What is the derivative with respect to x of ∫[0 to x^2] cos(t) dt?',
        options: ['cos(x^2)', '2x · cos(x^2)', '-sin(x^2)', '2x · sin(x^2)'],
        ans: 1,
        difficulty: 'Tough',
        stars_bonus: 5
      }
    ]
  }
};
