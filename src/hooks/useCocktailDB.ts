"use client";

import { useState, useEffect, useCallback } from 'react';
import { Cocktail } from '@/lib/db/neatDB';
import useIndexedDB from './useIndexedDB';

// Sample cocktail data for initial population
const sampleCocktails: Omit<Cocktail, 'id'>[] = [
  {
    name: 'Old Fashioned',
    description: 'A classic whiskey cocktail with a perfect balance of sweet and bitter.',
    glassware: 'rocks',
    ingredients: [
      { name: 'Bourbon', amount: '2', unit: 'oz' },
      { name: 'Simple Syrup', amount: '0.25', unit: 'oz' },
      { name: 'Angostura Bitters', amount: '2', unit: 'dashes' },
      { name: 'Orange Peel', amount: '1', unit: 'piece', optional: false },
    ],
    instructions: [
      'Add simple syrup and bitters to a rocks glass',
      'Add bourbon and stir',
      'Add ice (preferably a large cube)',
      'Garnish with an orange peel',
    ],
    tags: ['whiskey', 'classic', 'spirit-forward', 'evening'],
    dateAdded: new Date(),
    images: [],
    isFavorite: false,
  },
  {
    name: 'Daiquiri',
    description: 'A refreshing rum cocktail with the perfect balance of sweet and sour.',
    glassware: 'coupe',
    ingredients: [
      { name: 'White Rum', amount: '2', unit: 'oz' },
      { name: 'Lime Juice', amount: '0.75', unit: 'oz' },
      { name: 'Simple Syrup', amount: '0.75', unit: 'oz' },
    ],
    instructions: [
      'Add all ingredients to a shaker with ice',
      'Shake vigorously for 10-15 seconds',
      'Double strain into a chilled coupe glass',
      'Garnish with a lime wheel (optional)',
    ],
    tags: ['rum', 'refreshing', 'citrus', 'shaken', 'summer'],
    dateAdded: new Date(),
    images: [],
    isFavorite: false,
  },
  {
    name: 'Negroni',
    description: 'A perfectly balanced bitter and sweet Italian classic.',
    glassware: 'rocks',
    ingredients: [
      { name: 'Gin', amount: '1', unit: 'oz' },
      { name: 'Campari', amount: '1', unit: 'oz' },
      { name: 'Sweet Vermouth', amount: '1', unit: 'oz' },
    ],
    instructions: [
      'Add all ingredients to a mixing glass with ice',
      'Stir for 20-30 seconds until well-chilled',
      'Strain into a rocks glass over fresh ice',
      'Garnish with an orange peel',
    ],
    tags: ['gin', 'bitter', 'aperitif', 'italian', 'equal-parts'],
    dateAdded: new Date(),
    images: [],
    isFavorite: false,
  },
  {
    name: 'Margarita',
    description: 'A refreshing tequila cocktail with a perfect balance of sweet, sour, and salt.',
    glassware: 'rocks',
    ingredients: [
      { name: 'Tequila', amount: '2', unit: 'oz' },
      { name: 'Lime Juice', amount: '0.75', unit: 'oz' },
      { name: 'Cointreau', amount: '0.75', unit: 'oz' },
      { name: 'Salt', amount: '', unit: 'rim', optional: true },
    ],
    instructions: [
      'Rim a rocks glass with salt (optional)',
      'Add all ingredients to a shaker with ice',
      'Shake vigorously for 10-15 seconds',
      'Strain into the prepared glass over fresh ice',
      'Garnish with a lime wheel',
    ],
    tags: ['tequila', 'citrus', 'refreshing', 'summer', 'shaken'],
    dateAdded: new Date(),
    images: [],
    isFavorite: false,
  },
  {
    name: 'Manhattan',
    description: 'A sophisticated whiskey cocktail with a rich, complex flavor profile.',
    glassware: 'coupe',
    ingredients: [
      { name: 'Rye Whiskey', amount: '2', unit: 'oz' },
      { name: 'Sweet Vermouth', amount: '1', unit: 'oz' },
      { name: 'Angostura Bitters', amount: '2', unit: 'dashes' },
      { name: 'Maraschino Cherry', amount: '1', unit: 'piece', optional: false },
    ],
    instructions: [
      'Add all ingredients to a mixing glass with ice',
      'Stir for 20-30 seconds until well-chilled',
      'Strain into a chilled coupe glass',
      'Garnish with a maraschino cherry',
    ],
    tags: ['whiskey', 'classic', 'spirit-forward', 'evening'],
    dateAdded: new Date(),
    images: [],
    isFavorite: false,
  },
];

export default function useCocktailDB() {
  const { items: cocktails, loading, error, fetchItems, addItem, updateItem, deleteItem, getItem } = useIndexedDB<Cocktail>('cocktails');
  const [initialized, setInitialized] = useState(false);

  // Initialize the database with sample cocktails if empty
  const initializeDB = useCallback(async () => {
    if (!loading && cocktails.length === 0 && !initialized) {
      setInitialized(true);
      
      // Add sample cocktails
      for (const cocktail of sampleCocktails) {
        await addItem(cocktail as Cocktail);
      }
      
      // Refresh the list
      await fetchItems();
    }
  }, [loading, cocktails.length, initialized, addItem, fetchItems]);

  useEffect(() => {
    initializeDB();
  }, [initializeDB]);

  // Get a random cocktail
  const getRandomCocktail = useCallback(async () => {
    if (cocktails.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * cocktails.length);
    return cocktails[randomIndex];
  }, [cocktails]);

  // Filter cocktails by various criteria
  const filterCocktails = useCallback((criteria: {
    search?: string;
    spirit?: string;
    glassware?: string;
    tags?: string[];
  }) => {
    return cocktails.filter(cocktail => {
      // Filter by search term
      if (criteria.search && !cocktail.name.toLowerCase().includes(criteria.search.toLowerCase()) && 
          !cocktail.description.toLowerCase().includes(criteria.search.toLowerCase())) {
        return false;
      }
      
      // Filter by spirit
      if (criteria.spirit && !cocktail.ingredients.some(i => 
        i.name.toLowerCase().includes(criteria.spirit!.toLowerCase()))) {
        return false;
      }
      
      // Filter by glassware
      if (criteria.glassware && cocktail.glassware !== criteria.glassware) {
        return false;
      }
      
      // Filter by tags
      if (criteria.tags && criteria.tags.length > 0) {
        const hasAllTags = criteria.tags.every(tag => 
          cocktail.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        if (!hasAllTags) {
          return false;
        }
      }
      
      return true;
    });
  }, [cocktails]);

  // Add a rating
  const addRating = useCallback(async (ratingData: any) => {
    try {
      // In a real implementation, this would be saved to IndexedDB
      console.log('Rating saved:', ratingData);
      return true;
    } catch (error) {
      console.error('Error saving rating:', error);
      return false;
    }
  }, []);

  return {
    cocktails,
    loading,
    error,
    fetchCocktails: fetchItems,
    addCocktail: addItem,
    updateCocktail: updateItem,
    deleteCocktail: deleteItem,
    getCocktail: getItem,
    getRandomCocktail,
    filterCocktails,
    addRating,
  };
}
