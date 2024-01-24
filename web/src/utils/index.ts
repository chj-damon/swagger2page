export function mappingType(type?: string) {
  if (!type) return 'text';

  const mapping: Record<string, string> = {
    string: 'text',
    number: 'digit',
    boolean: 'switch',
    array: 'uploadDragger',
  };

  return mapping[type] || 'text';
}
