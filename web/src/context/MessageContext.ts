import { createContext } from 'react';

export const MessageContext = createContext<{
  pathInfo: OpenAPIPathMapValue | undefined;
}>({ pathInfo: undefined });
