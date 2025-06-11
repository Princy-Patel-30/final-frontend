import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../Components/Button';
import { ButtonTypes } from '../../Config/ButtonConfig';
import IconRenderer from '../Components/IconRenderer';
import { debounce } from 'lodash';
import { useSearchUsers, useFollow, useUnfollow } from '../../Hooks/useProfile';
import AvatarView from './Avatarview';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isManualSearch, setIsManualSearch] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const followMutation = useFollow(currentUser?.id);
  const unfollowMutation = useUnfollow(currentUser?.id);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        console.log('Setting debounced query:', value);
        setDebouncedQuery(value);
        setIsManualSearch(false);
      }, 600),
    [],
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) {
      debounceRef.current.cancel();
    }
    if (value.trim()) {
      debounceRef.current = debouncedSetQuery;
      debouncedSetQuery(value.trim());
    } else {
      debouncedSetQuery.cancel();
      setDebouncedQuery('');
    }
  };

  const handleSearch = () => {
    if (debounceRef.current) {
      debounceRef.current.cancel();
    }
    debouncedSetQuery.cancel();
    if (inputValue.trim()) {
      setIsManualSearch(true);
      setDebouncedQuery(inputValue.trim());
    } else {
      setDebouncedQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setDebouncedQuery('');
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
      debouncedSetQuery.cancel();
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFollowToggle = (user, e) => {
    e.stopPropagation();
    if (user.isFollowing) {
      unfollowMutation.mutate(user.id);
    } else {
      followMutation.mutate(user.id);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const { data, isLoading, isError, error, isFetching } = useSearchUsers(
    debouncedQuery,
    1,
    10,
    currentUser?.id,
  );

  console.log('Search Component Debug:', {
    debouncedQuery,
    data,
    isLoading,
    isError,
    error,
    usersLength: data?.users?.length,
  });

  const showLoading = (isLoading || isFetching) && debouncedQuery;
  const showResults = data?.users?.length > 0;
  const showNoResults =
    debouncedQuery && !showLoading && !showResults && !isError;
  const showWelcome = !debouncedQuery && !showLoading;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Search
        </h1>
        <div className="flex flex-col items-stretch gap-4 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('');
                  setDebouncedQuery('');
                  if (debounceRef.current) {
                    debounceRef.current.cancel();
                  }
                  debouncedSetQuery.cancel();
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
          <Button
            type={ButtonTypes.SEARCH}
            onClick={handleSearch}
            fullWidth={false}
            disabled={!inputValue.trim()}
            sx={{
              minWidth: '100px',
              height: '42px',
              padding: '0 16px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: !inputValue.trim() ? 0.6 : 1,
              cursor: !inputValue.trim() ? 'not-allowed' : 'pointer',
            }}
            text={
              <>
                <IconRenderer type="search" isRaw className="text-lg" />
                <span>Search</span>
              </>
            }
          />
        </div>
        {showLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-pink-500"></div>
            Searching for {debouncedQuery}...
          </div>
        )}
        <div className="mt-6">
          {isError ? (
            <div className="py-8 text-center">
              <p className="mb-2 text-red-600">
                Error: {error?.message || 'Something went wrong'}
              </p>
              <Button
                type={ButtonTypes.SECONDARY}
                onClick={() => {
                  if (debouncedQuery) {
                    handleSearch();
                  }
                }}
                text="Try Again"
                sx={{ padding: '8px 16px' }}
              />
            </div>
          ) : showResults ? (
            <div>
              <p className="mb-4 text-sm text-gray-600">
                {data.users.length} user{data.users.length !== 1 ? 's' : ''}{' '}
                found
                {data.total &&
                  data.total > data.users.length &&
                  ` (showing ${data.users.length} of ${data.total})`}
              </p>
              <ul className="divide-y divide-gray-200">
                {data.users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-gray-50"
                    onMouseEnter={() => setHoveredUserId(user.id)}
                    onMouseLeave={() => setHoveredUserId(null)}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <AvatarView src={user.avatarUrl} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-medium text-gray-900">
                        {user.name}
                      </h3>
                      {user.bio && (
                        <p className="truncate text-sm text-gray-500">
                          {user.bio}
                        </p>
                      )}
                      {user.username && (
                        <p className="text-xs text-gray-400">
                          @{user.username}
                        </p>
                      )}
                    </div>
                    {currentUser && user.id !== currentUser.id && (
                      <div className="flex-shrink-0">
                        <Button
                          type={
                            user.isFollowing && hoveredUserId === user.id
                              ? ButtonTypes.UNFOLLOW
                              : user.isFollowing
                                ? ButtonTypes.FOLLOWING
                                : ButtonTypes.FOLLOW
                          }
                          onClick={(e) => handleFollowToggle(user, e)}
                          text={
                            user.isFollowing && hoveredUserId === user.id
                              ? 'Unfollow'
                              : user.isFollowing
                                ? 'Following'
                                : 'Follow'
                          }
                          disabled={
                            followMutation.isPending ||
                            unfollowMutation.isPending
                          }
                          fullWidth={false}
                          sx={{
                            minWidth: '80px',
                            height: '36px',
                            padding: '0 12px',
                            fontSize: '0.875rem',
                            opacity:
                              followMutation.isPending ||
                              unfollowMutation.isPending
                                ? 0.6
                                : 1,
                          }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : showNoResults ? (
            <div className="py-8 text-center">
              <IconRenderer
                type="search"
                isRaw
                className="mb-4 text-4xl text-gray-300"
              />
              <p className="mb-2 text-gray-500">
                No users found for "{debouncedQuery}"
              </p>
              <p className="text-sm text-gray-400">
                Try a different search term
              </p>
            </div>
          ) : showWelcome ? (
            <div className="py-8 text-center">
              <IconRenderer
                type="search"
                isRaw
                className="mb-4 text-4xl text-gray-300"
              />
              <p className="mb-2 text-gray-500">find your friends here</p>
              <p className="text-sm text-gray-400">
                You can search by name, username, or bio
              </p>
            </div>
          ) : null}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-center text-xs text-gray-400">
            Press{' '}
            <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs">Enter</kbd>{' '}
            to search |
            <kbd className="ml-1 rounded bg-gray-100 px-1 py-0.5 text-xs">
              Esc
            </kbd>{' '}
            to clear
          </p>
        </div>
      </div>
    </div>
  );
};

export default Search;
