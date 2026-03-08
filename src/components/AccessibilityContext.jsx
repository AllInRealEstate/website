import { createContext, useContext } from 'react';

const AccessibilityContext = createContext({
  stopAnimations: false
});

export const AccessibilityProvider = AccessibilityContext.Provider;

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  return context;
};

export default AccessibilityContext;