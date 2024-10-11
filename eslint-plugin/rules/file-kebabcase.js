const path = require('path');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce file names to be in kebab-case',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    const filePath = context.getFilename();
    const fileNameWithExt = path.basename(filePath);
    const fileName = path.parse(fileNameWithExt).name; // Extract the name without extension
    const kebabCasePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const allowedExceptions = [
      'jest.config.js',
      'webpack.config.js',
      'babel.config.js',
      'eslint.config.js',
    ]; // List of allowed exceptions
    return {
      Program() {
        if (!kebabCasePattern.test(fileName)) {
          context.report({
            message: `File name '${fileNameWithExt}' is not in kebab-case.`,
            loc: { line: 1, column: 0 },
          });
        }
         // Skip exceptions
         if (allowedExceptions.includes(fileName)) {
          return;
        }
      },
    };
  },
};