import React, { useState, useEffect } from 'react';
import { BreedCollectionResponse, BreedData } from '../types/dog';

export const DogViewer: React.FC = () => {
  const [breeds, setBreeds] = useState<BreedData[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<BreedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch breeds on initial mount using Dog API V2
  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds?page[size]=50');
        const data: BreedCollectionResponse = await response.json();
        
        if (data.data && data.data.length > 0) {
          setBreeds(data.data);
          setSelectedBreed(data.data[0]);
        }
      } catch (err) {
        setError('Failed to load breeds from Dog API V2.');
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  // Handle dropdown change
  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const breedId = e.target.value;
    const found = breeds.find((b) => b.id === breedId);
    if (found) {
      setSelectedBreed(found);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg text-center space-y-6">
      <h1 className="text-2xl font-bold text-indigo-400">🐶 Dog API V2 Viewer</h1>

      {/* Breed Combo Box / Select */}
      <div className="flex flex-col text-left space-y-2">
        <label htmlFor="breed-select" className="text-sm font-medium text-slate-300">
          Select Dog Breed:
        </label>
        <select
          id="breed-select"
          value={selectedBreed?.id || ''}
          onChange={handleBreedChange}
          className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.attributes.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dog Details & Image Display */}
      <div className="relative w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-2 text-indigo-400">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading breeds...</span>
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm p-4">{error}</p>
        ) : selectedBreed ? (
          <>
            <div className="h-64 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="https://images.dogapi.dog/caucasian-shepherd-dog.jpg" 
                alt={selectedBreed.attributes.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // Fallback placeholder kung sakaling walang image URL sa object
                  (e.target as HTMLImageElement).src = 'https://images.dogapi.dog/bouvier-des-flandres.jpg';
                }}
              />
            </div>
            <div className="text-left space-y-2">
              <h2 className="text-lg font-semibold text-indigo-300">{selectedBreed.attributes.name}</h2>
              <p className="text-xs text-slate-300 line-clamp-3">{selectedBreed.attributes.description || 'No description available.'}</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Refresh / Reload Button */}
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center space-x-2"
      >
        <span>🔄 Reload App</span>
      </button>
    </div>
  );
};