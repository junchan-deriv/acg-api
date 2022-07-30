import { KeyedEntry } from "../definitions/core";

/**
 * Cached - A simple caching system which storing the id:index mapped at another array along side with the main array
 */
export type Cached<T extends KeyedEntry> = {
  /**
   * The entries
   */
  entries: T[];
  /**
   * The id index map
   */
  cache: {
    [key: KeyedEntry["id"]]: number;
  };
};

/**
 * A quick function to build the cached object
 * @param values the main array
 * @returns the built array
 * @throws Error if the values id are not unique
 */
export function makeCached<T extends KeyedEntry>(
  values: T[]
): Cached<T> | never {
  if (new Set<number>(values.map((g) => g.id)).size !== values.length) {
    throw new Error("Array content is not unique");
  }
  return {
    entries: values,
    cache: {},
  };
}

/**
 * Find and return the entry which array the said `id`
 * @param object the object to search from
 * @param id the id of the entry to find
 * @returns the object or null if it is not exists
 */
export function findEntry<T extends KeyedEntry>(
  object: Cached<T>,
  id: KeyedEntry["id"]
): T | null {
  let { cache, entries } = object;
  let index = cache[id];
  if (index !== undefined) {
    return entries[index];
  }
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].id === id) {
      cache[id] = i;
      return entries[i];
    }
  }
  return null;
}

/**
 * Add an entry into the table
 * @param table the table where it is saved
 * @param data the object to be saved
 * @returns the new id off the entry added
 */
export function addEntry<T extends KeyedEntry>(
  table: Cached<T>,
  data: T
): KeyedEntry["id"] {
  let lastIdx = (table.entries.length ?? 0) - 1;
  let id = lastIdx > 0 ? table.entries[lastIdx].id : 1;
  while (findEntry(table, id)) {
    id++; //if clash try next
  }
  //finally push this
  let tableIdx = table.entries.push(data) - 1;
  table.cache[id] = tableIdx;
  return id;
}
