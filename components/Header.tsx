"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fecthSuggestion from "@/utilities/fetchSuggestion";

const Header = () => {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<String>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fecthSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center px-4  bg-gray-500/10">
        <div
          className="absolute left-0 top-0 w-full h-96 bg-gradient-to-br 
        from-pink-400 
        to-[#0055D1]
        rounded-md
        filter 
        blur-3xl
        opacity-50
        -z-50
        "
        />
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/1920px-Trello_logo.svg.png?20210216184934"
          alt="Trello logo"
          width={300}
          height={100}
          className="w-44 md:w-56 p-10 md:p-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 w-full justify-end">
          <form
            action=""
            className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden className="">
              Search
            </button>
          </form>

          <Avatar name="Tazheeb Shamsi" round size="50" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className=" flex items-center p-2 text-sm font-light  pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055d1] border">
          <ArrowPathIcon
            className={`inline-block h-8 w-8 text-[#0055d1] mr-1
          ${loading && "animate-spin"}
          `}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising your task for the day..."}
        </p>
      </div>
    </header>
  );
};

export default Header;
