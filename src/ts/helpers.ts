//get json timeout

let userInteracted = { bool: false };

document.addEventListener("click", () => {
  userInteracted.bool = true;
});

export default userInteracted;

export function shuffleArray(inputArray: string[]): string[] {
  const arrayCopy = [...inputArray];
  const shuffledArray: string[] = [];

  while (arrayCopy.length > 0) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);

    const removedItem = arrayCopy.splice(randomIndex, 1)[0];
    shuffledArray.push(removedItem);
  }

  return shuffledArray;
}

export function ConvertStrToEnumType(page: string) {
  let type;
  switch (page) {
    case "player":
      type = ItemType.Track;
      break;
    case "album":
      type = ItemType.Album;
      break;
    case "artist":
      type = ItemType.Artist;
      break;
    default:
      throw new Error("Invalid type of Item send to search");
  }
  return type;
}

export function isTupleUnique(
  arr: [ItemType, string][],
  itemToCheck: [ItemType, string]
): boolean {
  return arr.every(
    (item) => item[0] !== itemToCheck[0] || item[1] !== itemToCheck[1]
  );
}

export enum ItemType {
  Album,
  Track,
  Artist,
}
