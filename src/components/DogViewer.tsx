import React, { useState, useEffect } from 'react';
import type { BreedCollectionResponse, BreedData, BreedImage } from '../types/dog';

export const DogViewer: React.FC = () => {
  const [breeds, setBreeds] = useState<BreedData[]>([]);
  const [selectedBreedId, setSelectedBreedId] = useState<string>('');
  const [displayedBreed, setDisplayedBreed] = useState<BreedData | null>(null);
  const [displayedImage, setDisplayedImage] = useState<BreedImage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrorId, setImageErrorId] = useState<string | null>(null);

  // Fetch breeds on initial mount using Dog API V2
  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds?page[size]=50');
        const data: BreedCollectionResponse = await response.json();
        
        if (data.data && data.data.length > 0) {
          setBreeds(data.data);
          setSelectedBreedId(data.data[0].id);
          setDisplayedBreed(data.data[0]);
          setDisplayedImage(data.data[0].attributes.images?.[0] ?? null);
        }
      } catch (err) {
        setError('Failed to load breeds from Dog API V2.');
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const breed = breeds.find((item) => item.id === e.target.value);
    if (breed) {
      setSelectedBreedId(breed.id);
      setDisplayedBreed(breed);
      setDisplayedImage(breed.attributes.images?.[0] ?? null);
      setImageErrorId(null);
    }
  };

  const handleFetchAgain = () => {
    const images = displayedBreed?.attributes.images ?? [];
    if (images.length > 0) {
      const currentIndex = images.findIndex((image) => image.id === displayedImage?.id);
      const nextImages = images.length > 1
        ? images.filter((_, index) => index !== currentIndex)
        : images;
      const randomImage = nextImages[Math.floor(Math.random() * nextImages.length)];
      setDisplayedImage(randomImage);
      setImageErrorId(null);
    }
  };

  const imageUrl = displayedImage?.large || displayedImage?.medium || displayedImage?.url;

  return (
    <section className="dog-card" aria-labelledby="dog-viewer-title">
      <header className="dog-header">
        <div className="brand-mark" aria-hidden="true">🐾</div>
        <div>
          <p className="eyebrow">THE BREED COLLECTION</p>
          <h1 id="dog-viewer-title">Meet your next favorite</h1>
          <p className="header-caption">A little more about the dogs we love.</p>
        </div>
      </header>

      <div className="breed-picker">
        <label htmlFor="breed-select">Choose a breed</label>
        <select
          id="breed-select"
          value={selectedBreedId}
          onChange={handleBreedChange}
        >
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.attributes.name}
            </option>
          ))}
        </select>
      </div>

      <div className="dog-showcase">
        {loading ? (
          <div className="status-panel" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            <span>Finding lovely dogs...</span>
          </div>
        ) : error ? (
          <p className="status-panel error-message" role="alert">{error}</p>
        ) : displayedBreed ? (
          <>
            <div className="dog-image-frame">
              {imageUrl && imageErrorId !== displayedImage?.id ? (
                <img
                  src={imageUrl}
                  alt={displayedBreed.attributes.name}
                  className="dog-image"
                  onError={() => setImageErrorId(displayedImage?.id ?? null)}
                />
              ) : (
                <p className="image-fallback">No image available for this breed.</p>
              )}
              <span className="image-tag">BREED SPOTLIGHT</span>
            </div>
            <div className="breed-details">
              <div className="breed-title-row">
                <h2>{displayedBreed.attributes.name}</h2>
                <span className="breed-dot" aria-hidden="true">✦</span>
              </div>
              <p>{displayedBreed.attributes.description || 'No description available.'}</p>
            </div>
          </>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleFetchAgain}
        disabled={!selectedBreedId || loading}
        className="fetch-button"
      >
        <span>Fetch another photo</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M20 7v5h-5M4 17v-5h5m-4.1-2a7 7 0 0 1 11.6-3L20 12M4 12l3.5 5a7 7 0 0 0 11.6-3" />
        </svg>
      </button>
      <p className="card-footnote">Showing a new photo from the selected breed</p>
    </section>
  );
};