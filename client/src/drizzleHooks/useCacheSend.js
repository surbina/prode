import { useMemo, useState } from 'react';
import useDrizzle from './useDrizzle';

function useCacheSend(contractName, methodName) {
  const { drizzle, drizzleState } = useDrizzle();
  const [stackId, setStackId] = useState('');
  const contract = drizzle.contracts[contractName];

  const send = useMemo(
    () => (...parameters) => {
      const newStackId = contract.methods[methodName].cacheSend(...parameters);

      setStackId(newStackId);
      return newStackId;
    },
    [contract, methodName, setStackId]
  );

  const txHash = drizzleState.transactionStack[stackId];

  return { send, stackId, tx: txHash && drizzleState.transactions[txHash] };
}

export default useCacheSend;
