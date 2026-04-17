export {};
// =============================================================================
//  16 | REACT + TYPESCRIPT
// =============================================================================
//
//  Prerequisites : 15_error_handling.ts
//  Next File     : 17_interview_prep.ts
//
//  This file covers:
//    1. Component props typing
//    2. Children prop
//    3. useState<T>
//    4. useRef<T>
//    5. useReducer with TypeScript
//    6. Event handlers in React
//    7. Generic components
//    8. Context API typing
//    9. Common patterns & recipes
//
//  NOTE: This file uses .ts extension (not .tsx) for consistency with
//  the rest of the documentation. In a real React project, use .tsx.
//  Examples are designed to be READ, not run directly.
//
// =============================================================================


// -----------------------------------------------------------------------------
//  SECTION 1 — COMPONENT PROPS TYPING
// -----------------------------------------------------------------------------

// Every React component's props should be explicitly typed.

// INLINE PROPS (simple components):
// function Greeting({ name, age }: { name: string; age: number }) {
//   return <h1>Hello, {name}! You are {age}.</h1>;
// }

// EXTRACTED INTERFACE (recommended for reuse and clarity):
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger"; // optional with literal union
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

// function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
//   return (
//     <button
//       className={`btn btn-${variant}`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {label}
//     </button>
//   );
// }

// USING THE COMPONENT:
// <Button label="Submit" onClick={() => console.log("clicked")} />
// <Button label="Delete" onClick={handleDelete} variant="danger" />

// TYPE vs INTERFACE for props:
// Both work. Interface is conventional in React projects.
// type ButtonProps = { ... }  // also fine


// -----------------------------------------------------------------------------
//  SECTION 2 — CHILDREN PROP
// -----------------------------------------------------------------------------

// React components that accept children need to type them.

// OPTION 1: React.PropsWithChildren<T>
// interface CardProps {
//   title: string;
// }
//
// function Card({ title, children }: React.PropsWithChildren<CardProps>) {
//   return (
//     <div className="card">
//       <h2>{title}</h2>
//       <div className="card-body">{children}</div>
//     </div>
//   );
// }

// OPTION 2: Explicitly type children
// interface LayoutProps {
//   children: React.ReactNode;  // most flexible — text, elements, arrays, etc.
//   sidebar?: React.ReactNode;
// }

// OPTION 3: Restrict children type
// interface StrictCardProps {
//   children: React.ReactElement;  // only JSX elements (not strings/numbers)
// }
// interface StringOnlyProps {
//   children: string;  // only plain text
// }

// ReactNode vs ReactElement:
// ReactNode = string | number | boolean | ReactElement | null | undefined | array
// ReactElement = JSX element only (<div />, <Component />)
// Use ReactNode for most cases (it's the most flexible).


// -----------------------------------------------------------------------------
//  SECTION 3 — useState<T>
// -----------------------------------------------------------------------------

// useState is generic — TS infers the type from the initial value.

// INFERRED TYPES:
// const [count, setCount] = useState(0);        // number
// const [name, setName] = useState("Ayushman"); // string
// const [active, setActive] = useState(true);   // boolean

// EXPLICIT TYPES (needed when initial value doesn't tell the full story):
// const [user, setUser] = useState<User | null>(null);
// // TS knows user can be User OR null

// const [items, setItems] = useState<string[]>([]);
// // TS knows items is string[] (not never[])

// const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
// // Literal union type

// COMMON MISTAKE — forgetting to type null initial state:
// const [user, setUser] = useState(null);
// // TS infers: null — you can NEVER set a User!
// // FIX: useState<User | null>(null)

// INTERFACE FOR STATE:
interface FormState {
  username: string;
  email: string;
  errors: string[];
}

// const [form, setForm] = useState<FormState>({
//   username: "",
//   email: "",
//   errors: [],
// });

// UPDATING STATE WITH SPREAD:
// setForm(prev => ({ ...prev, username: "NewName" }));


// -----------------------------------------------------------------------------
//  SECTION 4 — useRef<T>
// -----------------------------------------------------------------------------

// useRef is generic — the type parameter determines what it can hold.

// DOM ELEMENT REFS:
// const inputRef = useRef<HTMLInputElement>(null);
// // inputRef.current is HTMLInputElement | null

// // In the component:
// <input ref={inputRef} />
//
// function focusInput() {
//   inputRef.current?.focus(); // safe access
// }

// MUTABLE VALUE REFS (like instance variables):
// const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//
// function startTimer() {
//   timerRef.current = setTimeout(() => console.log("done"), 1000);
// }
//
// function stopTimer() {
//   if (timerRef.current) clearTimeout(timerRef.current);
// }

// DIFFERENCE:
// useRef<HTMLElement>(null)  -> .current is readonly (for DOM refs)
// useRef<number>(0)          -> .current is mutable (for values)


// -----------------------------------------------------------------------------
//  SECTION 5 — useReducer WITH TYPESCRIPT
// -----------------------------------------------------------------------------

// useReducer is perfect with discriminated unions.

interface CounterState {
  count: number;
  lastAction: string;
}

type CounterAction =
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + action.amount, lastAction: "increment" };
    case "DECREMENT":
      return { count: state.count - action.amount, lastAction: "decrement" };
    case "RESET":
      return { count: 0, lastAction: "reset" };
  }
}

// Usage in component:
// const [state, dispatch] = useReducer(counterReducer, { count: 0, lastAction: "" });
// dispatch({ type: "INCREMENT", amount: 5 }); // fully typed!
// dispatch({ type: "RESET" });
// dispatch({ type: "INCREMENT" }); // ERROR — missing `amount`

// MORE COMPLEX EXAMPLE — form reducer:
interface TodoState {
  items: { id: number; text: string; done: boolean }[];
  filter: "all" | "active" | "done";
}

type TodoAction =
  | { type: "ADD_TODO"; text: string }
  | { type: "TOGGLE_TODO"; id: number }
  | { type: "DELETE_TODO"; id: number }
  | { type: "SET_FILTER"; filter: TodoState["filter"] };


// -----------------------------------------------------------------------------
//  SECTION 6 — EVENT HANDLERS IN REACT
// -----------------------------------------------------------------------------

// React has its own event types (SyntheticEvents) that wrap native events.

// CLICK EVENT:
// function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
//   console.log("Clicked at:", e.clientX, e.clientY);
//   e.preventDefault();
// }
// <button onClick={handleClick}>Click</button>

// CHANGE EVENT (inputs):
// function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//   console.log("Value:", e.target.value);
// }
// <input onChange={handleChange} />

// FORM SUBMIT:
// function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//   e.preventDefault();
//   const formData = new FormData(e.currentTarget);
//   console.log("Username:", formData.get("username"));
// }
// <form onSubmit={handleSubmit}>...</form>

// KEYBOARD EVENT:
// function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//   if (e.key === "Enter") {
//     console.log("Enter pressed!");
//   }
// }

// COMMON REACT EVENT TYPES:
//   React.MouseEvent<HTMLElement>       — onClick, onMouseEnter
//   React.ChangeEvent<HTMLInputElement> — onChange (inputs)
//   React.FormEvent<HTMLFormElement>    — onSubmit
//   React.KeyboardEvent<HTMLElement>    — onKeyDown, onKeyUp
//   React.FocusEvent<HTMLElement>       — onFocus, onBlur
//   React.DragEvent<HTMLElement>        — onDrag, onDrop
//   React.WheelEvent<HTMLElement>       — onWheel

// INLINE EVENT HANDLERS — TS infers the type:
// <button onClick={(e) => console.log(e.clientX)}>Click</button>
// e is automatically React.MouseEvent<HTMLButtonElement>


// -----------------------------------------------------------------------------
//  SECTION 7 — GENERIC COMPONENTS
// -----------------------------------------------------------------------------

// Components that work with any data type:

// GENERIC LIST COMPONENT:
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

// function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
//   return (
//     <ul>
//       {items.map((item, i) => (
//         <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
//       ))}
//     </ul>
//   );
// }

// Usage:
// <List
//   items={users}
//   renderItem={(user) => <span>{user.name}</span>}
//   keyExtractor={(user) => user.id}
// />

// GENERIC SELECT COMPONENT:
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
}

// function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
//   return (
//     <select
//       value={getValue(value)}
//       onChange={(e) => {
//         const selected = options.find(o => getValue(o) === e.target.value);
//         if (selected) onChange(selected);
//       }}
//     >
//       {options.map(opt => (
//         <option key={getValue(opt)} value={getValue(opt)}>
//           {getLabel(opt)}
//         </option>
//       ))}
//     </select>
//   );
// }


// -----------------------------------------------------------------------------
//  SECTION 8 — CONTEXT API TYPING
// -----------------------------------------------------------------------------

// Typed React Context for global state:

interface AuthState {
  user: { id: number; name: string } | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (user: { id: number; name: string }) => void;
  logout: () => void;
}

// Create context with a default value:
// const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Custom hook for safe access:
// function useAuth(): AuthContextType {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// Provider component:
// function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [state, setState] = useState<AuthState>({
//     user: null,
//     isAuthenticated: false,
//   });
//
//   const login = (user: { id: number; name: string }) => {
//     setState({ user, isAuthenticated: true });
//   };
//
//   const logout = () => {
//     setState({ user: null, isAuthenticated: false });
//   };
//
//   return (
//     <AuthContext.Provider value={{ state, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// -----------------------------------------------------------------------------
//  SECTION 9 — COMMON PATTERNS & RECIPES
// -----------------------------------------------------------------------------

// PATTERN 1: Polymorphic "as" prop (render as different elements)
// interface BoxProps<T extends React.ElementType = "div"> {
//   as?: T;
//   children: React.ReactNode;
// }
// function Box<T extends React.ElementType = "div">({
//   as, children, ...props
// }: BoxProps<T> & React.ComponentPropsWithoutRef<T>) {
//   const Component = as || "div";
//   return <Component {...props}>{children}</Component>;
// }
// <Box as="section" className="wrapper">...</Box>

// PATTERN 2: Forwarding refs with types
// const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
//   return <input ref={ref} {...props} />;
// });

// PATTERN 3: Discriminated union props
// type AlertProps =
//   | { variant: "success"; showConfetti?: boolean }
//   | { variant: "error"; retryAction: () => void }
//   | { variant: "info" };

// PATTERN 4: Required with children
// type StrictLayoutProps = Required<Pick<LayoutProps, "children">> & {
//   sidebar?: React.ReactNode;
// };


// -----------------------------------------------------------------------------
//  QUICK REFERENCE CARD
// -----------------------------------------------------------------------------
//
//  PATTERN                     TYPE
//  --------------------------  -------------------------------------------
//  Component props             interface Props { name: string; }
//  Children                    React.ReactNode (flexible)
//  useState                    useState<Type>(initialValue)
//  useRef (DOM)                useRef<HTMLInputElement>(null)
//  useRef (value)              useRef<number>(0)
//  useReducer                  useReducer(reducer, initialState)
//  onClick                     React.MouseEvent<HTMLButtonElement>
//  onChange (input)             React.ChangeEvent<HTMLInputElement>
//  onSubmit                    React.FormEvent<HTMLFormElement>
//  onKeyDown                   React.KeyboardEvent<HTMLElement>
//  Context                     createContext<Type | undefined>(undefined)
//  forwardRef                  forwardRef<HTMLInputElement, Props>


// -----------------------------------------------------------------------------
//  INTERVIEW QUESTIONS
// -----------------------------------------------------------------------------
//
//  Q1: How do you type React component props?
//  A: Define an interface for the props and use it as the function's parameter
//     type. For optional props, use ? or default values.
//
//  Q2: What is the difference between ReactNode and ReactElement?
//  A: ReactNode is broad: string, number, boolean, JSX elements, arrays, null.
//     ReactElement is narrow: only JSX elements. Use ReactNode for children.
//
//  Q3: When do you need to explicitly type useState?
//  A: When the initial value doesn't represent all possible states.
//     Example: useState<User | null>(null) — null alone would infer as
//     just null, not User | null.
//
//  Q4: How do you type event handlers in React?
//  A: Use React's event types: React.MouseEvent<HTMLButtonElement>,
//     React.ChangeEvent<HTMLInputElement>, etc. The element type param
//     specifies which HTML element the event came from.
//
//  Q5: What are generic components?
//  A: Components with a type parameter that lets them work with any data
//     type. Example: a List<T> component that renders any array of items
//     while keeping the item type for renderItem and keyExtractor typed.
//
//  Q6: How do you type React Context?
//  A: Create context with createContext<Type | undefined>(undefined).
//     Write a custom hook that checks for undefined and throws if the
//     context is used outside its Provider.


console.log("-- 16_react_typescript.ts loaded (reference only) --");
