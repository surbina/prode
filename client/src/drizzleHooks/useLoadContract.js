import { useEffect } from 'react';

import useDrizzle from './useDrizzle';

function useLoadContract(contractData, contractAddress) {
  const {
    drizzle,
    drizzleState: {
      web3: { networkId },
    },
  } = useDrizzle();

  useEffect(() => {
    if (!drizzle.contracts[contractAddress]) {
      drizzle.addContract({
        abi: contractData.abi,
        networks: {
          [networkId]: {
            address: contractAddress,
          },
        },
        contractName: contractAddress,
      });
    }
  }, [drizzle, contractAddress, contractData, networkId]);
}

export default useLoadContract;
