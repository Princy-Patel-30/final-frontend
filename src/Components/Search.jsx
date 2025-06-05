import { useState } from 'react';
import Button from '../Components/Button';
import { ButtonTypes } from '../../Config/ButtonConfig';
import IconRenderer from '../Components/IconRenderer';

const Search = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800">Search</h1>
        <div className="flex flex-col items-stretch gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <Button
            type={ButtonTypes.SEARCH}
            onClick={handleSearch}
            fullWidth={false}
            sx={{
              minWidth: '100px',
              height: '42px',
              padding: '0 16px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            text={
              <>
                <IconRenderer type="search" isRaw className="text-lg" />
                <span>Search</span>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
