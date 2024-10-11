module.exports = {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce function names to be in camelCase',
        category: 'Stylistic Issues',
        recommended: false,
      },
      schema: [], // No options
    },
    create(context) {
      return {
        FunctionDeclaration(node) {
          const functionName = node.id.name;
          const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
  
          if (!camelCasePattern.test(functionName)) {
            context.report({
              node,
              message: `Function name '${functionName}' is not in camelCase.`,
            });
          }
        },
      };
    },
  };
  