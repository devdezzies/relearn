/**
 * Safely evaluates a mathematical expression with a given x value
 */
export function evaluateExpression(expression: string, x: number): number {
  // Replace mathematical operators with JavaScript equivalents
  const jsExpression = expression
    .replace(/\^/g, '**')  // Replace ^ with **
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/pi/g, 'Math.PI')
    .replace(/e/g, 'Math.E');

  try {
    // Create a function that evaluates the expression
    const fn = new Function('x', `return ${jsExpression}`);
    return fn(x);
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return NaN;
  }
}

/**
 * Generates points for plotting a mathematical function
 */
export function generatePlotPoints(expression: string, xRange: [number, number], samples = 200) {
  const [min, max] = xRange;
  const step = (max - min) / (samples - 1);
  
  const points = Array.from({ length: samples }, (_, i) => {
    const x = min + i * step;
    const y = evaluateExpression(expression, x);
    return { x, y };
  });

  // Filter out any invalid points (NaN, Infinity)
  const validPoints = points.filter(p => !isNaN(p.y) && isFinite(p.y));
  
  return {
    x: validPoints.map(p => p.x),
    y: validPoints.map(p => p.y)
  };
} 