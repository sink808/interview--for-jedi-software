import React, { useState, useEffect, useCallback } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import Maze from "@/model/api/maze/maze";
import { LuRat } from "react-icons/lu";
import { FaCheese } from "react-icons/fa";

interface MazeProps {
  mazeData: Maze[];
}

interface MazeBlock {
  maze: Maze;
}

interface Position {
  row: number;
  col: number;
}

const MOVING_SPEED = 100;

const MazeBlock: React.FC<MazeBlock> = ({ maze }) => {
  const startRow = maze.findIndex((row) => row.includes("start"));
  const startCol = maze[startRow].indexOf("start");
  const [isStarting, setIsStarting] = useState(false);
  const [path, setPath] = useState<Position[]>([]);
  const [visited, setVisited] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position>({
    row: startRow,
    col: startCol,
  });
  const [previousDirection, setPreviousDirection] = useState<Position | null>(
    null
  );

  const isCurrent = (row: number, col: number) =>
    row === currentPosition.row && col === currentPosition.col;
  const isVisited = (row: number, col: number) =>
    visited.some((pos) => pos.row === row && pos.col === col);
  const isInPath = (row: number, col: number) =>
    path.some((pos) => pos.row === row && pos.col === col);

  const moveRat = () => {
    const { row, col } = currentPosition;
    const directions = [
      { row: -1, col: 0 }, // 上
      { row: 1, col: 0 }, // 下
      { row: 0, col: -1 }, // 左
      { row: 0, col: 1 }, // 右
    ];
    const newPath = [...path];

    if (!currentPosition || maze[row][col] === "end") {
      return;
    }

    if (previousDirection) {
      // 將上一次的方向放到第一個
      directions.unshift(previousDirection);
    }

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (
        newRow >= 0 &&
        newRow < maze.length &&
        newCol >= 0 &&
        newCol < maze[0].length &&
        maze[newRow][newCol] !== "wall" &&
        !isVisited(newRow, newCol)
      ) {
        // 代表可以走
        setVisited((prevVisited) => [
          ...prevVisited,
          { row: newRow, col: newCol },
        ]);
        setCurrentPosition({ row: newRow, col: newCol });
        setPath((prevPath) => [...prevPath, { row: newRow, col: newCol }]);
        setPreviousDirection(dir);
        return;
      }
    }

    // 不能走後退一格
    newPath.pop();
    setPath(newPath);
    setCurrentPosition(newPath[newPath.length - 1]);
  };

  const handleStart = useCallback(() => {
    setIsStarting(true);
    setPath([{ row: startRow, col: startCol }]);
    setVisited([{ row: startRow, col: startCol }]);
  }, [startRow, startCol]);

  const handleReset = useCallback(() => {
    setIsStarting(false);
    setCurrentPosition({ row: startRow, col: startCol });
    setPath([]);
    setVisited([]);
    setPreviousDirection(null);
  }, [startRow, startCol]);

  useEffect(() => {
    if (isStarting && currentPosition) {
      const timer = setTimeout(() => {
        moveRat();
      }, MOVING_SPEED);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarting, currentPosition]);

  return (
    <div className="w-fit mx-auto my-4 px-8 flex flex-col items-center [&:not(:last-child)]:border-b-2">
      <div>
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <React.Fragment key={`${rowIndex}-${colIndex}`}>
                {isCurrent(rowIndex, colIndex) && (
                  <LuRat className="w-4 h-4 text-neutral-500 bg-amber-200" />
                )}
                {isInPath(rowIndex, colIndex) &&
                  !isCurrent(rowIndex, colIndex) && (
                    <div className="bg-amber-200 w-4 h-4" />
                  )}
                {cell === "path" &&
                  !isCurrent(rowIndex, colIndex) &&
                  !isInPath(rowIndex, colIndex) && (
                    <div className="bg-lime-50 w-4 h-4" />
                  )}
                {cell === "end" && !isCurrent(rowIndex, colIndex) && (
                  <FaCheese className="w-4 h-4 text-amber-400" />
                )}
                {cell === "wall" && <div className="bg-green-800 w-4 h-4" />}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      <button
        className="bg-amber-500 hover:bg-amber-400 w-40 h-6 rounded my-4"
        onClick={isStarting ? handleReset : handleStart}
      >
        {isStarting ? "Reset" : "Start"}
      </button>
    </div>
  );
};

const FindTheCheese: React.FC<MazeProps> = ({ mazeData }) => (
  <main className="bg-amber-50 min-h-screen">
    <div className="p-4">
      <div className="p-4 max-w-[720px] mx-auto bg-white rounded shadow">
        <Head>
          <title>Find the cheese</title>
        </Head>
        <h1 className="text-2xl font-bold text-center m-2">Find the cheese</h1>
        <p className="text-center mx-2">
          Click 'Start' to see how the mouse finds the cheese by using DFS!
        </p>
        {mazeData.map((maze, index) => (
          <React.Fragment key={index}>
            <MazeBlock maze={maze} />
          </React.Fragment>
        ))}
      </div>
    </div>
  </main>
);

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/maze");
    const mazeData = response.data;

    return {
      props: {
        mazeData,
      },
    };
  } catch (error) {
    console.error("Error fetching maze data:", error);

    return {
      props: {
        mazeData: null,
      },
    };
  }
};

export default FindTheCheese;
