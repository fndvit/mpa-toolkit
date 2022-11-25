declare module 'brace-expansion' {
  type _ExtractT<T extends string> = T extends `${infer First},${infer Remaining}` ? First | _ExtractT<Remaining> : T;

  type _ExpandContents<T extends string> = T extends `${infer First},${infer Remaining}`
    ? First | _ExtractT<Remaining>
    : `{${T}}`;

  type _ExpandBraces<T extends string> = T extends `${infer Before}{${infer Contents}}${infer After}`
    ? `${_ExpandBraces<Before>}${_ExpandContents<Contents>}${_ExpandBraces<After>}`
    : `${T}`;

  type BraceExpansion = <T extends string>(input: T) => _ExpandBraces<T>[];

  const expand: BraceExpansion;
  export = expand;
}
