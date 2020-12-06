import { useEffect, useState } from 'react';
import useDrizzle from './useDrizzle';

function useCacheCall(contractName, methodName) {
  const { drizzle, drizzleState, initialized } = useDrizzle();
  const [dataKey, setDataKey] = useState('');

  const contract = drizzle.contracts[contractName];

  useEffect(() => {
    if (drizzleState.drizzleStatus.initialized && contract) {
      const newDataKey = contract.methods[methodName].cacheCall();
      setDataKey(newDataKey);
    }
  }, [
    contract,
    contractName,
    methodName,
    setDataKey,
    drizzleState.drizzleStatus.initialized,
  ]);

  return {
    value:
      initialized &&
      dataKey &&
      drizzleState.contracts[contractName][methodName][dataKey]
        ? drizzleState.contracts[contractName][methodName][dataKey].value
        : null,
    isLoading:
      !initialized ||
      !drizzleState.contracts[contractName] ||
      !drizzleState.contracts[contractName][methodName][dataKey],
  };
}

export default useCacheCall;
