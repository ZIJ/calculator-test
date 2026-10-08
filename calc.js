// Expression evaluator: + - * / % ^, parentheses, unary minus, decimals.
// Recursive descent; no eval.

export function evaluate(input) {
  const tokens = tokenize(input);
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const expect = (t) => {
    if (next() !== t) throw new Error(`Expected '${t}'`);
  };

  // expr   := term (('+' | '-') term)*
  // term   := unary (('*' | '/' | '%') unary)*
  // unary  := '-' unary | power
  // power  := atom ('^' unary)?        (right-associative)
  // atom   := number | '(' expr ')'
  function expr() {
    let v = term();
    while (peek() === "+" || peek() === "-") {
      v = next() === "+" ? v + term() : v - term();
    }
    return v;
  }
  function term() {
    let v = unary();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = next();
      const r = unary();
      if ((op === "/" || op === "%") && r === 0) throw new Error("Division by zero");
      v = op === "*" ? v * r : op === "/" ? v / r : v % r;
    }
    return v;
  }
  function unary() {
    if (peek() === "-") {
      next();
      return -unary();
    }
    if (peek() === "+") {
      next();
      return unary();
    }
    return power();
  }
  function power() {
    const base = atom();
    if (peek() === "^") {
      next();
      return base ** unary();
    }
    return base;
  }
  function atom() {
    const t = next();
    if (t === "(") {
      const v = expr();
      expect(")");
      return v;
    }
    if (typeof t === "number") return t;
    throw new Error(t === undefined ? "Unexpected end of input" : `Unexpected '${t}'`);
  }

  if (tokens.length === 0) throw new Error("Empty expression");
  const result = expr();
  if (pos < tokens.length) throw new Error(`Unexpected '${tokens[pos]}'`);
  return result;
}

function tokenize(input) {
  const tokens = [];
  const s = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      const m = /^\d*\.?\d*/.exec(s.slice(i))[0];
      if (m === ".") throw new Error("Invalid number");
      tokens.push(parseFloat(m));
      i += m.length;
    } else if ("+-*/%^()".includes(c)) {
      tokens.push(c);
      i++;
    } else {
      throw new Error(`Invalid character '${c}'`);
    }
  }
  return tokens;
}

// Round away float noise like 0.1 + 0.2 = 0.30000000000000004.
export function format(n) {
  if (!Number.isFinite(n)) throw new Error("Result is not finite");
  return String(parseFloat(n.toPrecision(12)));
}
