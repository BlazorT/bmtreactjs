import globalutil from 'src/util/globalutil';

export const getOperatorsForId = (id) => {
  const operators = {
    1: [
      // String
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
      { name: 'contains', label: 'contains' },
      { name: 'beginsWith', label: 'beginsWith' },
      { name: 'endsWith', label: 'endsWith' },
      { name: 'doesNotContain', label: 'doesNotContain' },
      { name: 'doesNotBeginWith', label: 'doesNotBeginWith' },
      { name: 'doesNotEndWith', label: 'doesNotEndWith' },
      { name: 'in', label: 'in' },
      { name: 'notIn', label: 'notIn' },
    ],
    2: [
      // Int
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
      { name: '<', label: '<' },
      { name: '>', label: '>' },
      { name: '<=', label: '<=' },
      { name: '>=', label: '>=' },
      { name: 'in', label: 'in' },
      { name: 'notIn', label: 'notIn' },
      { name: 'between', label: 'between' },
      { name: 'notBetween', label: 'notBetween' },
    ],
    3: [
      // Date
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
      { name: '<', label: '<' },
      { name: '>', label: '>' },
      { name: '<=', label: '<=' },
      { name: '>=', label: '>=' },
      { name: 'in', label: 'in' },
      { name: 'notIn', label: 'notIn' },
      { name: 'between', label: 'between' },
      { name: 'notBetween', label: 'notBetween' },
    ],
    4: [
      // DateTime
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
      { name: '<', label: '<' },
      { name: '>', label: '>' },
      { name: '<=', label: '<=' },
      { name: '>=', label: '>=' },
      { name: 'in', label: 'in' },
      { name: 'notIn', label: 'notIn' },
      { name: 'between', label: 'between' },
      { name: 'notBetween', label: 'notBetween' },
    ],
    5: [
      // Boolean
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
    ],
    6: [], // JSON (no predefined operators, you can add custom ones if needed)
    7: [], // Object (no predefined operators, you can add custom ones if needed)
  };

  return operators[id] || [];
};
