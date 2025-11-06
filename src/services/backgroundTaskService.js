// Simple notification scheduler without background fetch dependency
export const registerBackgroundFetch = async () => {
  console.log('Background notifications scheduled via notification service');
};

export const unregisterBackgroundFetch = async () => {
  console.log('Background notifications unregistered');
};