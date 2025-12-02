export const resolveRelativePath = (currentFilePath: string, relativeLink: string): string => {
  // 1. Strip hash and query parameters
  const cleanLink = relativeLink.split('#')[0].split('?')[0];

  // Detect separator (Windows uses backslash, others use forward slash)
  const isWindows = currentFilePath.includes('\\');
  const separator = isWindows ? '\\' : '/';

  // 2. Get directory of current file (pop the filename off)
  const currentDir = currentFilePath.split(separator).slice(0, -1);
  
  // 3. Split relative link by '/' (Markdown links standardly use forward slashes)
  const segments = cleanLink.split('/');

  // 4. Iterate through relativeLink segments
  for (const segment of segments) {
    if (segment === '..') {
      // Pop from current directory stack
      if (currentDir.length > 0) {
        currentDir.pop();
      }
    } else if (segment === '.') {
      // Ignore current directory symbol
      continue;
    } else {
      // Push to stack
      currentDir.push(segment);
    }
  }

  // 5. Join stack with the detected separator
  return currentDir.join(separator);
};
