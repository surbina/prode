import { useContext } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';

function useDrizzle() {
  const drizzleValue = useContext(DrizzleContext.Context);

  if (!drizzleValue) {
    throw new Error('useDrizzle must be used within a DrizzleContext.Provider');
  }

  return drizzleValue;
}

export default useDrizzle;
