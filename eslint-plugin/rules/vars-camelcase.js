module.exports = {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce variable names to be in camelCase',
        category: 'Stylistic Issues',
        recommended: false,
      },
      schema: [], // No options
    },
    create(context) {
      const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/; // Pattern for camelCase
      const upperCasePattern = /^[A-Z_]+$/; // Pattern for constants (uppercase snake case)
  
      return {
        VariableDeclarator(node) {
          const variableName = node.id.name;
  
          // Skip variables written in all uppercase (constants like PORT)
          if (upperCasePattern.test(variableName)) {
            return;
          }
  
          // Enforce camelCase for all other variable names
          if (!camelCasePattern.test(variableName)) {
            context.report({
              node,
              message: `Variable name '${variableName}' is not in camelCase.`,
            });
          }
        },
      };
    },
  };