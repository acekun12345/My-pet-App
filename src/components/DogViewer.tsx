import React, { useState, useEffect } from 'react';
import { BreedListResponse, DogImageResponse } from '../types/dog';

export const DogViewer: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dog breeds on initial mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data: BreedListResponse = await response.json();
        const breedArray = Object.keys(data.message);
        setBreeds(breedArray);

        if (breedArray.length > 0) {
          setSelectedBreed(breedArray[0]);
        }
      } catch (err) {
        setError('Failed to load breed list.');
      }
    };

    fetchBreeds();
  }, []);

  // Fetch image based on selected breed
  const fetchDogImage = async (breed: string) => {
    if (!breed) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
      const data: DogImageResponse = await response.json();
      setImageUrl(data.message);
    } catch (err) {
      setError('Failed to fetch dog image.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger image fetch whenever selectedBreed changes
  useEffect(() => {
    if (selectedBreed) {
      fetchDogImage(selectedBreed);
    }
  }, [selectedBreed]);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md text-center space-y-6">
      <h1 className="text-2xl font-bold text-indigo-400">🐶 Random Dog Generator</h1>

      {/* Breed Combo Box / Select */}
      <div className="flex flex-col text-left space-y-2">
        <label htmlFor="breed-select" className="text-sm font-medium text-slate-300">
          Select Dog Breed:
        </label>
        <select
          id="breed-select"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize cursor-pointer"
        >
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* Dog Image Display */}
      <div className="relative w-full h-72 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-2 text-indigo-400">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Fetching cute dog...</span>
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm p-4">{error}</p>
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              alt={`Random ${selectedBreed}`}
              className="w-full h-full object-cover rounded-xl transition-all duration-300 hover:scale-105"
            />
          )
        )}
      </div>

      {/* Fetch Again Button */}
      <button
        onClick={() => fetchDogImage(selectedBreed)}
        disabled={loading || !selectedBreed}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center space-x-2"
      >
        <span>🔄 Fetch Again</span>
      </button>
    </div>
  );
};