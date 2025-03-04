import Dexie, { Table } from 'dexie';

// Define types for our database schema
export interface Cocktail {
  id?: number;
  name: string;
  description: string;
  glassware: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  rating?: number;
  dateAdded: Date;
  images: string[]; // Base64 encoded images
  notes?: string;
  isFavorite: boolean;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  optional?: boolean;
}

export interface Rating {
  id?: number;
  itemType: 'spirit' | 'beer' | 'wine' | 'cocktail';
  itemSubType?: string; // e.g., 'whiskey', 'gin', etc.
  itemName: string;
  brand?: string;
  scores: {
    aroma: number;
    flavor: number;
    mouthfeel: number;
    finish: number;
    overall: number;
  };
  totalScore: number;
  notes?: string;
  images?: string[]; // Base64 encoded images
  dateAdded: Date;
}

export interface BarInventory {
  id?: number;
  name: string;
  category: string;
  subCategory?: string;
  amount?: string;
  dateAdded: Date;
  notes?: string;
  image?: string; // Base64 encoded image
}

// Define our database
export class NeatDB extends Dexie {
  cocktails!: Table<Cocktail, number>;
  ratings!: Table<Rating, number>;
  barInventory!: Table<BarInventory, number>;

  constructor() {
    super('neatDB');
    this.version(1).stores({
      cocktails: '++id, name, glassware, tags, rating, dateAdded, isFavorite',
      ratings: '++id, itemType, itemSubType, itemName, brand, totalScore, dateAdded',
      barInventory: '++id, name, category, subCategory, dateAdded'
    });
  }
}

// Create a single instance of the database
const db = new NeatDB();

export default db;
