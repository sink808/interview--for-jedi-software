import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import axios from 'axios';
import Maze from "@/model/api/maze/maze";
import { LuRat } from "react-icons/lu";
import { FaCheese } from "react-icons/fa";

interface MazeProps {
  mazeData: Maze[];
}

interface MazeBlock {
  maze: Maze;
  key: string
}

const MazeBlock: React.FC<MazeBlock> = ({maze, key}) => {
  const [isSolving, setIsSolving] = useState(false);
 
  const handleStart = () => {
    setIsSolving(true);
  };

  const handleReset = () => {
    setIsSolving(false);
  };

  return (
    <div className="w-fit mx-auto my-4 px-8 flex flex-col items-center border-b-2" key={key}>
      <div>
      {maze.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
              >
                {cell === 'start' && <LuRat className='w-4 h-4 text-neutral-500'/>}
                {cell === 'end' && <FaCheese className='w-4 h-4 text-amber-400'/>}
                {cell === 'wall' && <div className='bg-green-800 w-4 h-4'></div>}
                {cell === 'path' && <div className='bg-lime-50 w-4 h-4'></div>}
              </div>
            ))
          }
        </div>
      ))}
      </div>
      <button className='bg-yellow-500 w-40 h-6 rounded my-4' onClick={ isSolving ? handleReset : handleStart}>{isSolving ? 'Reset' : 'Start'}</button>
    </div>
  )
}

const FindTheCheese: React.FC<MazeProps> = ({ mazeData }) => (
  <div>
    <Head>
      <title>Find the cheese</title>
    </Head>
    <h1 className="text-2xl font-bold text-center m-2">Find the cheese</h1>
    <p className="text-center mx-2">Click 'Start' to see how the mouse finds the cheese by using DFS!</p>
    {mazeData.map((maze, index) => (
      <MazeBlock maze={maze} key={`${index}`}></MazeBlock>
    ))}
  </div>
);


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/maze');
    const mazeData = response.data;

    return {
      props: {
        mazeData,
      },
    };
  } catch (error) {
    console.error('Error fetching maze data:', error);

    return {
      props: {
        mazeData: null,
      },
    };
  }
};

export default FindTheCheese;