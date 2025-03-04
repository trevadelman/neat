import { useState, useEffect, useCallback } from 'react';
import db from '../lib/db/neatDB';

type CollectionName = 'cocktails' | 'ratings' | 'barInventory';

function useIndexedDB<T>(collection: CollectionName) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all items from the collection
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db[collection].toArray();
      setItems(result as unknown as T[]);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${collection}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [collection]);

  // Add a new item to the collection
  const addItem = useCallback(async (item: T) => {
    try {
      const id = await db[collection].add(item as any);
      await fetchItems();
      return id;
    } catch (err) {
      console.error(`Error adding to ${collection}:`, err);
      throw err;
    }
  }, [collection, fetchItems]);

  // Update an item in the collection
  const updateItem = useCallback(async (id: number, changes: Partial<T>) => {
    try {
      await db[collection].update(id, changes as any);
      await fetchItems();
    } catch (err) {
      console.error(`Error updating in ${collection}:`, err);
      throw err;
    }
  }, [collection, fetchItems]);

  // Delete an item from the collection
  const deleteItem = useCallback(async (id: number) => {
    try {
      await db[collection].delete(id);
      await fetchItems();
    } catch (err) {
      console.error(`Error deleting from ${collection}:`, err);
      throw err;
    }
  }, [collection, fetchItems]);

  // Get a single item by id
  const getItem = useCallback(async (id: number) => {
    try {
      return await db[collection].get(id) as T;
    } catch (err) {
      console.error(`Error getting item from ${collection}:`, err);
      throw err;
    }
  }, [collection]);

  // Load items on initial render
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    getItem
  };
}

export default useIndexedDB;
