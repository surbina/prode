import { useMemo } from 'react';
import useDrizzle from './useDrizzle';

function useDrizzleState(selector) {
  const { drizzleState } = useDrizzle();

  return useMemo(() => selector(drizzleState), [drizzleState, selector]);
}

export default useDrizzleState;
