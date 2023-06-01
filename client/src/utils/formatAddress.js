export const formatAddress = (ethAddress, firstCharacter) => {
  const firstCharacters = ethAddress.substring(0, firstCharacter);
  const lastCharacters = ethAddress.substring(ethAddress.length - 2);
  return firstCharacters + "..." + lastCharacters;
};
